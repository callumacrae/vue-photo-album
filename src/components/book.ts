import * as THREE from 'three';
import { PhotoDescription } from '../utils/photo-data';

interface Sheet {
  object: THREE.Object3D;
  index: number;
}

// TERMINOLOGY:
// there are one or more photos per page
// there are two pages per sheet
// the book is comprised of sheets + covers
// the user looks at spreads, which is two pages, one from each sheet

export default class Book {
  private group: THREE.Group;
  private frontCover: THREE.Object3D;
  private backCover: THREE.Object3D;
  private sheets: Sheet[];
  private photos: PhotoDescription[];
  private currentSpread: number;

  constructor(photos: PhotoDescription[]) {
    const group = new THREE.Group();
    this.group = group;

    this.photos = photos;
    // @TODO fix maths for this
    this.currentSpread = 4;

    const coverGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.03);
    coverGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(1.1, 0, 0));
    const coverMaterial = new THREE.MeshStandardMaterial({ color: 0x50301a });

    const frontCover = new THREE.Mesh(coverGeometry, coverMaterial);
    frontCover.position.z = -0.02;
    group.add(frontCover);
    this.frontCover = frontCover;

    const backCover = new THREE.Mesh(coverGeometry, coverMaterial);
    backCover.position.z = -0.02;
    group.add(backCover);
    this.backCover = backCover;

    const pageGeometry = new THREE.PlaneGeometry(2.1, 2.97);
    const plainMaterial = new THREE.MeshStandardMaterial({
      color: 'white',
      side: THREE.DoubleSide
    });

    // A sheet is two pages (plus a blank one at beginning and end)
    const sheetCount = Math.ceil(photos.length / 2) + 2;

    const sheets: Sheet[] = [];
    for (let i = 0; i < sheetCount; i++) {
      if (i === 0 || i === sheetCount - 1) {
        const sheet = new THREE.Mesh(pageGeometry, plainMaterial);
        group.add(sheet);
        sheets.push({ object: sheet, index: i });
        continue;
      }

      const sheet = new THREE.Group();

      const frontPageMaterial = new THREE.MeshStandardMaterial({
        map: this.getPageTexture(i * 2 - 2)
      });

      const frontPage = new THREE.Mesh(pageGeometry, frontPageMaterial);
      sheet.add(frontPage);

      const backPageMaterial = new THREE.MeshStandardMaterial({
        map: this.getPageTexture(i * 2 - 1)
      });

      const backPage = new THREE.Mesh(pageGeometry, backPageMaterial);
      backPage.rotateY(Math.PI);
      sheet.add(backPage);

      group.add(sheet);
      sheets.push({ object: sheet, index: i });
    }
    this.sheets = sheets;

    this.setSheetAngles();
  }

  public getGroup() {
    return this.group;
  }

  public update(t: number) {
    // this.group.rotation.y = t;
  }

  private setSheetAngles() {
    const frontRotation = this.getSheetAngle(0);
    this.frontCover.rotation.y = frontRotation;
    this.frontCover.position.z =
      frontRotation > (Math.PI / 8) * 12 ? 0.02 : -0.02;
    this.backCover.rotation.y = this.getSheetAngle(this.sheets.length - 1);

    this.sheets.forEach((page, i) => {
      page.object.rotateY(this.getSheetAngle(i));
      page.object.translateX(1.05);
    });
  }

  private getSheetAngle(index: number) {
    const min = (Math.PI / 8) * 9;
    const max = (Math.PI / 8) * 15;

    const eachSheetAngle = Math.PI / 128;

    if (index < this.currentSpread) {
      return min + eachSheetAngle * index;
    }

    const reverseIndex = this.sheets.length - 1 - index;
    return max - eachSheetAngle * reverseIndex;
  }

  private getPageTexture(pageIndex: number) {
    const ctx = document.createElement('canvas').getContext('2d');

    if (!ctx) {
      // Dammit typescript
      throw new Error('?!?!?!');
    }

    ctx.canvas.width = 210;
    ctx.canvas.height = 297;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 210, 297);

    const photo = this.photos[pageIndex];

    if (!photo || !photo.image) {
      throw new Error('No image');
    }

    ctx.drawImage(photo.image, 50, 50, 100, 100);

    return new THREE.CanvasTexture(ctx.canvas);
  }
}