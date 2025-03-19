import { Component } from '@angular/core';
import { CameraService } from '../services/camera.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  imageUrl!: string;
  constructor(private cameraService: CameraService) {}
  async takePicture() {
    this.imageUrl = await this.cameraService.takePicture();
  }
}
