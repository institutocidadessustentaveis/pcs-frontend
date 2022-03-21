import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaTag } from '../model/metaTag';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitleTagService {

  private urlMeta: string = "og:url";
  private titleMeta: string = "og:title";
  private descriptionMeta: string = "og:description";
  private imageMeta: string = "og:image";
  private secureImageMeta: string = "og:image:secure_url";
  private twitterTitleMeta: string = "twitter:text:title";
  private twitterImageMeta: string = "twitter:image";

  constructor(private titleService: Title, private metaService: Meta) { }

  public setTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  public setSocialMediaTags(url: string, title: string, description: string, image: string): void {
    var imageUrl = image;
    var tags = [
      new MetaTag(this.urlMeta, url, true),
      new MetaTag(this.titleMeta, title, true),
      new MetaTag(this.descriptionMeta, description, true),
      new MetaTag(this.imageMeta, imageUrl, true),
      new MetaTag(this.secureImageMeta, imageUrl, true),
      new MetaTag(this.twitterTitleMeta, title, false),
      new MetaTag(this.twitterImageMeta, imageUrl, false)
    ];
    this.setTags(tags);
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      const tag = siteTag.isFacebook ?  this.metaService.getTag(`property='${siteTag.name}'`) : this.metaService.getTag(`name='${siteTag.name}'`);
      if (siteTag.isFacebook) {
        this.metaService.updateTag({ property: siteTag.name, content: siteTag.value });
      } else {
        this.metaService.updateTag({ name: siteTag.name, content: siteTag.value });
      }
    });
  }
}
