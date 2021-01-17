# insta_pic_vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Steps to run code
```
On development machine
1. clone this repo
2. run 'npm install'
3. run 'npm run serve'
```
```
On production machine (assuming ubuntu instance)
1. clone this repo
2. run 'npm install'
3. run 'npm run build'
4. move dist folder to /var/www/html/
5. set nginx to point to dist directory (snippet below)
```
### nginx snippet
```
location / {
	root /var/www/html/insta-pic-vue/dist;
	try_files $uri $uri/ /index.html;
    }

```
