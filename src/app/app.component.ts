import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'raeg-website';
  constructor(private router:Router){}
  ngOnInit() {
    // Subscribe to Router events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Remove the body class on every URL change
        this.updateBodyClass();
      });
  }

  private updateBodyClass(): void {
    // Remove the body class
    const body = document.body;
    body.classList.remove('mobile-menu-visible'); // Replace 'your-class-name' with your actual class name
  }
}
