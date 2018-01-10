import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../auth/auth.service';
import { IMediaItem } from '../../interfaces/media/media-item.interface';
import { Upload } from './upload.class';

@Injectable()
export class MediaItemService {

  private collectionRef: AngularFirestoreCollection<IMediaItem>;
  private path = `mediaItems`;
  mediaItems$: Observable<IMediaItem[]>;

  constructor(private afs: AngularFirestore,
              private authService: AuthService) {
    this.collectionRef = this.afs.collection<IMediaItem>(this.path);
    this.mediaItems$ = this.collectionRef.valueChanges();
  }

  createMediaItem(mediaItem: IMediaItem): Promise<void> {
    mediaItem.id = this.afs.createId();
    return this.afs.collection(this.path).doc(mediaItem.id).set(mediaItem);
  }

  removeMediaItem(mediaItem: IMediaItem): Promise<any> {
    return this.afs.collection(this.path).doc(mediaItem.id).delete();
  }

  updateMediaItem(mediaItemId: string, mediaItem: IMediaItem): Promise<any> {
    return this.afs.collection(this.path).doc(mediaItemId).update(mediaItem);
  }

  getMediaItemById(mediaItemId: string): Observable<IMediaItem> {
    return this.afs.doc<IMediaItem>(this.path + '/' + mediaItemId).valueChanges();
  }

  setNewMediaItem(upload: Upload, downloadUrl: string): IMediaItem {
    return {
      id: upload.id,
      assignedObjects: upload.assignedObjects,
      downloadUrl: downloadUrl,
      name: upload.name,
      size: upload.file.size,
      type: upload.file.type,
      isExternal: false,
      creation: this.authService.getCreation()
    };
  }


}
