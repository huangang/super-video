import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


// declare const electron
// declare const path

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  url: string;
  type: string;
  player: SafeResourceUrl;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public sanitizer: DomSanitizer) {
    this.type = 'http://www.ou522.cn/t2/1.php?url=';
    // console.log('Electron is now available: ', electron);
    // console.log('Electron remote is now available: ', electron.remote);
    // console.log('Path is now available: ', path)
  }

  public watch(){
    if(!this.url && !this.type){
      this.presentToast('接口和地址不能为空');
      return;
    }
    if(!this.url){
      this.presentToast('地址不能为空');
      return;
    }
    if(!this.type){
      this.presentToast('接口不能为空');
      return;
    }
    if (!this.checkUrl(this.url)){
      this.presentToast('地址不合法!');
      return;
    }
    let value = this.type + this.url;
    console.log(value);
    this.player = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

  checkUrl (url){
    let str = url;
    //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
    // 下面的代码中应用了转义字符"\"输出一个字符"/"
    let Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    let objExp=new RegExp(Expression);
    return objExp.test(str) == true;
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
}
