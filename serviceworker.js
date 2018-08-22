const version = 'V0.01';
const staticCacheName = version + 'staticfiles';

addEventListener( 'install', installEvent => {
	skipWaiting();
	installEvent.waitUntil(
		caches.open(staticCacheName)
		.then( staticCache => {
			// Nice to have: these items won't block the installation of the Service Worker
			// staticCache.addAll([]);
			// Must have: these items must be cached for the Service Worker to complete installation
			return staticCache.addAll([
				'styles.css',
				'sprites.svg',
				'scripts.js'
			]); // end return addAll
		}) // end open then
	); // end waitUntil
}); // end addEventListner

addEventListener('fetch', fetchEvent => {
	const request = fetchEvent.request;
	fetchEvent.respondWith(
		caches.match(request)
		.then( responseFromCache => {
			if (responseFromCache) {
				return responseFromCache;
			} // end if
			// Otherwise fetch from the network
			return fetch(request);
		}) // end match then
		// fetch(request)
		// .then(responseFromFetch => {
		// 	return responseFromFetch;
		// }) // end fetch then
		// .catch(error => {
		// 	return new Response(
		// 		'<h1>Oops!</h1> <p>Something went wrong.</p>', {
		// 			headers: {'Content-type': 'text/html; charset=utf-8'}
		// 		}
		// 	);
		// }) // end fetch catch
	); // end respondWith
}); // end addEventListner

addEventListener('activate', activateEvent => {
	activateEvent.waitUntil(
		caches.keys()
		.then( cacheNames => {
			return Promise.all(
				cacheNames.map( cacheName => {
					if (cacheName != staticCacheName) {
						return caches.delete(cacheName);
					} // end if
				}) // end map
			); // end return Promise.all
		}) // end keys then
		.then( () => {
			return clients.claim();
		}) // end then
	); // end waitUntil
}); // end addEventListener