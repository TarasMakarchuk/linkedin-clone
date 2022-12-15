import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Role } from '../../../auth/models/user.model';
import { AuthService } from '../../../auth/services/auth.service';
import { FileTypeResult, fromBuffer } from 'file-type';

type validFileExtension = 'png' | 'jpg' | 'jpeg' | 'gif';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/gif';

type BannerColors = {
  colorOne: string;
  colorTwo: string;
  colorThree: string;
};

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  form: FormGroup;

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg', 'gif'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

  userImagePath: string;
  private userSubscription: Subscription;

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  bannerColors: BannerColors = {
    colorOne: '#a0b4b7',
    colorTwo: '#dbe7e9',
    colorThree: '#bfd3d6',
  };
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null),
    });

    this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
      this.bannerColors = this.getBannerColors(role);
    });

    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });

    this.userSubscription = this.authService.userImagePath.subscribe(
      (imagePath: string) => {
        this.userImagePath = imagePath;
    });
  };

  private getBannerColors(role: Role): BannerColors {
    switch (role) {
      case 'admin':
        return {
          colorOne: '#daa520',
          colorTwo: '#f0e68c',
          colorThree: '#fafad2',
        };
      case 'premium':
        return {
          colorOne: '#bc8f8f',
          colorTwo: '#c09999',
          colorThree: '#ddadaf',
        };
      default:
        return this.bannerColors;
    }
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
  };

}
