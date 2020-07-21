import * as THREE from 'three';
import { PhotoDescription} from '../utils/photo-data';

interface Page {
  mesh: THREE.Mesh;
  index: number;
}

export default class Book {
  private group: THREE.Group;
  private frontCover: THREE.Object3D;
  private backCover: THREE.Object3D;
  private sheets: Page[];
  private photos: PhotoDescription[];
  private currentSpread: number;

  constructor(photos: PhotoDescription[]) {
    const group = new THREE.Group();
    this.group = group;

    this.photos = photos;
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
    pageGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(1.05, 0, 0));
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    // A sheet is two pages (plus a blank one at beginning and end)
    const sheetCount = Math.ceil(photos.length / 2) + 2;

    const sheets: Page[] = [];
    for (let i = 0; i < sheetCount; i++) {
      const sheet = new THREE.Mesh(pageGeometry, pageMaterial);
      group.add(sheet);
      sheets.push({ mesh: sheet, index: i });
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
      page.mesh.rotation.y = this.getSheetAngle(i);
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
}
