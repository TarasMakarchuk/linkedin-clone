import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../../auth/models/user.model';
import { AuthService } from '../../../auth/services/auth.service';
import { FileTypeResult, fromBuffer } from 'file-type';
import { BannerColorService } from '../../services/banner-color.service';

type validFileExtension = 'png' | 'jpg' | 'jpeg' | 'gif';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/gif';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, public bannerColorService: BannerColorService) {}

  form: FormGroup;

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg', 'gif'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

  userImagePath: string;
  private userImagePathSubscription: Subscription;
  private userSubscription: Subscription;

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null),
    });

    this.userImagePathSubscription = this.authService.userImagePath.subscribe(
      (imagePath: string) => {
        this.userImagePath = imagePath;
    });

    this.userSubscription = this.authService.userStream.subscribe((user: User) => {
      if (user?.role) {
        this.bannerColorService.bannerColors = this.bannerColorService.getBannerColors(user.role);
      }

      if (user && user?.firstName && user?.lastName) {
        this.fullName = `${user.firstName} ${user.lastName}`;
        this.fullName$.next(this.fullName);
      }
    });
  };

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: Buffer) => {
          return from(fromBuffer(buffer)).pipe(
            switchMap((fileTypeResult: FileTypeResult) => {
              if (!fileTypeResult) {
                //TODO: error handling
                console.log({ error: 'File format not supported' });
                return of();
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(ext as any);
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                //TODO: error handling
                console.log({ error: 'File format doesn\'t match file extension' });
                return of();
              }

              return this.authService.uploadUserImage(formData);
            })
          )
        })
      ).subscribe()
    this.form.reset();
  };

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.userImagePathSubscription.unsubscribe();
  };

}
