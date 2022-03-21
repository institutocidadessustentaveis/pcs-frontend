import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo-service.service';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.css']
})
export class SeoComponent implements OnInit {

  constructor(private seoService: SeoService, private titleService: Title,
              private http: HttpClient,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.seo();
  }

  seo() {
    this.http.get(`${environment.API_URL}seo`).subscribe(res => {
      const config: any = res;
      config.width = this.route.snapshot.paramMap.get('width');
      config.height = this.route.snapshot.paramMap.get('height');
      console.log(config)
      this.titleService.setTitle(config.title);
      this.seoService.generateTags(config);
    });
  }
}
