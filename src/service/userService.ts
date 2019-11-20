import makeReactive from 'src/until/makeReactive';
import { ApiService, CacheService } from '.';
import { User } from './model';

class UserService {
  current: User = null;

  /** 管理员登录 */
  async login(info: { username: string; password: string }) {
    const { data } = await ApiService.post('user/adminlogin', info);
    this.current = data;
    CacheService.set('user', this.current);
    //    apiService.get('',"aaa")
  }
}

export default makeReactive(new UserService());
