import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { StripTagsPipe } from '../components/strip-tags/strip-tags.pipe';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
    urlEndPoint = `${environment.API_URL}seo`;
    constructor(private meta: Meta, private http: HttpClient) { }

    generateTags(config) {
      // default values
      const pipeRemoveTagsHtml = new StripTagsPipe();
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:site', content: '@cidsustentaveis' });
      this.meta.updateTag({ name: 'twitter:image', content: config.twitterImage });      
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      this.meta.updateTag({ property: 'og:site_name', content: config.site });
      this.meta.updateTag({ property: 'og:title', content: config.title });
      this.meta.updateTag({ property: 'og:description', content:  config.description ? pipeRemoveTagsHtml.transform(config.description) : '' });
      this.meta.updateTag({ property: 'og:image', content: config.image });
      this.meta.updateTag({ property: 'og:image:alt', content: 'Programa Cidades Sustentáveis' });
      this.meta.updateTag({ property: 'og:image:width', content: config.width ? config.width : '800' });
      this.meta.updateTag({ property: 'og:image:height', content: config.height ? config.height : '800' });
      this.meta.updateTag({ property: 'og:url', content: config.url });
      this.meta.updateTag({ property: 'og:updated_time', content: `${new Date().getTime()}` });
    }

    atualizarPagina(pagina) {
      return this.http.post(`${this.urlEndPoint}`, `${pagina}`);
    }
}
