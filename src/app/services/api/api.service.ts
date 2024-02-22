import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl: string = environment.apiUrl;
  is_autologout=true;
  public current_year:number=new Date().getFullYear();
  private currentUserSubject!: BehaviorSubject<any>;
  public currentUser!: Observable<any>;

  public globalEventEmitter$: any = new EventEmitter<{}>();
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  callApi(
    endpoint: string,
    method: 'get' | 'post' | 'patch' | 'put' | 'delete',
    params: any = {},
    id: string | null = null,
    files: FileList | null = null
  ): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}${id ? `/${id}` : ''}`;

    if (method === 'get') {
      const queryParams = new HttpParams({ fromObject: params });
      return this.http.get(url, { params: queryParams });
    } else if (method === 'post') {
      if (files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i], files[i].name);
        }
        return this.http.post(url, formData);
      } else {
        return this.http.post(url, params);
      }
    } else if (method === 'put') {
      return this.http.put(url, params);
    } else if (method === 'patch') {
      return this.http.patch(url, params);
    } else if (method === 'delete') {
      return this.http.delete(url);
    } else {
      throw new Error(`Invalid API method for ${endpoint}`);
    }
  }
  

  public downloadFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }


  // NEW CODE

  public get(collectionORendpoint: string, params:any={}): Observable<any> {
    console.log(params)
    let urlendpoint = collectionORendpoint;
  
    if (collectionORendpoint.startsWith('/')) {
      urlendpoint = this.apiUrl + '/' + collectionORendpoint;
    } else {
      urlendpoint = this.apiUrl + '/items/' + collectionORendpoint;
    }
  
    // Check if 'filter' parameter exists and if it's an object
    if (params?.filter !== undefined && params?.filter !== null) {
      params.filter = JSON.stringify(params.filter);
    }
  
    const get$ = this.http.get<any>(urlendpoint, {
      params: this.removeUndefinedParams(params),
    });
  
    return get$;
  }


  private removeUndefinedParams(params: any): HttpParams {
    let cleanedParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        cleanedParams = cleanedParams.append(key, params[key]);
      }
    }
    return cleanedParams;
  }


  public save<T>(collection: string, payload: any): Observable<T> {
    const isEdit = payload && payload['id']; // Check if it's an edit (has an 'id')
    const url = isEdit
      ? `${this.apiUrl}/${collection}/${payload['id']}`
      : `${this.apiUrl}/${collection}`;
  
    // ... other logic ...
  
    const save$ = isEdit
      ? this.http.patch<T>(url, payload)
      : this.http.post<T>(url, payload);
  
    return save$;
  }


  auth(action:any='login',payload:any={},provider:any=''){
    let url=this.apiUrl+'/auth';
        switch(action){
          case 'login':
            url+='/login';
            
          break;

          case 'refresh':
            url+='/refresh';
            console.log(this.currentUserValue);
            payload={refresh_token:this.currentUserValue?.session?.refresh_token};
            if(!payload.refresh_token){
              //return observable error
              return new Observable((observer) => {
                observer.error('refresh_token not found');
                observer.complete();
              });
            }
          break;

          case 'logout':
            payload={refresh_token:this.currentUserValue.refresh_token};
          break;

          case 'register':
            url=this.apiUrl+'/player/register?access_token='+environment.access_token;

          break;

          case 'sendotp':
            url = this.apiUrl+'/player/sendotp';
          break;

          case 'verifyotp':
            url = this.apiUrl+'/player/verifyotp';
          break;

        }

        //send POST request
        return this.http.post<any>(url, payload).pipe(
          tap((res) => {
            console.log('auth tap',res)
            if (res.data?.access_token) {
              // Update the currentUserSubject after the HTTP POST request completes
              this.currentUserSubject.next({ session: res.data });
              this.getSetCurrentUser(res.data);
            }
          }),
          map((res) => {
            console.log('auth map', res);
            if (res.data?.access_token) {
              return res;
            }else if(res.success){
              return res;
            } else {
              throw new Error('Authentication failed'); // Adjust error handling as needed
            }
          })
        );
  }


  getSetCurrentUser(session:any={}){
    // console.log('getSetCurrentUser',this.currentUser,session);
    console.log('getSetCurrentUser',this.currentUserValue);
    //console.log(this.currentUserValue?.id);
    if(this.currentUserValue?.id || session?.access_token){
      this.get('/users/me',{fields:'*,tenant.*,role.id,role.name,role.slug'}, ).subscribe((res:any)=>{ 
        console.log('setuserInfo',res.data);
        this.setUser({...res.data,session:session});
      });
    }
  }

  setUser(user: any) {
    let uid = user.name ?? user.first_name + ' - ' + user.mobile;
    console.log('assign id ' + uid.toString());
    //this.analytics.setUserId(uid.toString());
    //_paq.push(['setUserId', uid]);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    // _paq.push(['trackPageView']);
    this.globalEventEmitter$.emit({refreshuser:true,user:user}); 
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }


  logout(goto='') {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.clear();
    this.currentUserSubject.next(null!);
    this.router.navigate(['/'+goto, { replaceUrl: true }]);
  }

  uploadFile(fileo:any, blob:any, reportProgress = false) {
    //console.log(fileo,blob);
    let formData: FormData = new FormData();
    formData.append('file', blob, fileo.name);

    return this.http
      .post<any>(environment.apiUrl + '/files', formData)
      .pipe(map((res) => res));
  }


  md5(inputString: string) {
    var hc="0123456789abcdef";
    function rh(n: number) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x: number,y: number) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n: number,c: number)            {return (n<<c)|(n>>>(32-c));}
    function cm(q: number,a: any,b: any,x: any,s: any,t: any)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a: number,b: number,c: number,d: number,x: any,s: number,t: number)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a: number,b: number,c: number,d: number,x: any,s: number,t: number)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a: number,b: number,c: number,d: number,x: any,s: number,t: number)  {return cm(b^c^d,a,b,x,s,t);}
    function ii(a: number,b: number,c: number,d: number,x: any,s: number,t: number)  {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x: string) {
        var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    var i,x=sb(""+inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
    for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
        a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
        b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
        c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
        d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
        b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
        d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
        a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
        b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
        c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
        d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
        a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
        b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
        c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
        d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
        a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
        b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
        c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
        d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
        a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
        b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
  }

}