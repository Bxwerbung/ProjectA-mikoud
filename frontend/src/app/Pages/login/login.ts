import { Component } from '@angular/core';
  import { MatButtonModule } from '@angular/material/button';
  import { MatInputModule } from '@angular/material/input';
  import { MatIconModule } from '@angular/material/icon';
import { Router  } from '@angular/router';
import { Logger } from '../../utils/logger';
@Component({
  selector: 'app-login',
  imports: 
  [
    MatButtonModule,MatInputModule,MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private router: Router) {}

  isHidden = false;
  public onLoginClick() 
  {
        // Hier kommt der folge code für den handler 
        Logger('info', 'User attempted to log in');
        this.isHidden = !this.isHidden;
        setTimeout(() => 
        {
          this.router.navigate(['/Home']); 
        }, 300);


  } 
}
