import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  items = [
    {key: 'blog', url: 'http://blog.huangang.net'},
    {key: 'github', url: 'https://github.com/huangang'},
    {key: 'weibo', url: 'http://weibo.com/zhanghuangang/'}
  ];
  constructor(public navCtrl: NavController) {

  }

  itemSelected(item){
    window.open(item.url);
  }
}
