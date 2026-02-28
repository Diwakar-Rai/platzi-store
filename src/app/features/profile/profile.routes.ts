import { Routes } from '@angular/router';
import { Profile } from './pages/profile/profile';
import { authGuard } from '../../core/gaurds/auth-guard';

export const PROFILE_ROUTES: Routes = [{ path: '', component: Profile, canActivate: [authGuard] }];
