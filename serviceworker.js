const version = 'V0.02';
const staticCacheName = version + 'staticfiles';
const imageCacheName = 'images';
const pagesCacheName = 'pages';

const cacheList = [ staticCacheName, imageCacheName, pagesCacheName ];

addEventListener( 'install', installEvent => {
	skipWaiting();
	installEvent.waitUntil(
		caches.open(staticCacheName)
		.then( staticCache => {
			// Nice to have: these items won't block the installation of the Service Worker
			// staticCache.addAll([]);
			// Must have: these items must be cached for the Service Worker to complete installation
			return staticCache.addAll([
				'/assets/styles.css',
				'/assets/sprites.svg',
				'/assets/scripts.js',
				'/offline.html',
				'/fallback.svg'
			]); // end return addAll
		}) // end open then
	); // end waitUntil
}); // end addEventListner

addEventListener('fetch', fetchEvent => {
	const request = fetchEvent.request;

	// When the user requests an HTML file
	if (request.headers.get('Accept').includes('text/html')) {

		// When the requested page is an article
		if (/\/articles\/.+/.test(request.url)) {
			fetchEvent.respondWith (
				// Look in the cache
				caches.match(request)
				.then( responseFromCache => {
					if (responseFromCache) {
						// Fetch a fresh version from the network
						fetchEvent.waitUntil(
							fetch(request)
							.then( responseFromFetch => {
								// Update the cache
								caches.open(pagesCacheName)
								.then( pagesCache => {
									return pagesCache.put(request, responseFromFetch);
								}); // end open then
							}) // end fetch then
						); // end waitUntil
						return responseFromCache;
					} // end if
					// Otherwise fetch the page from the network
					return fetch(request)
					.then( responseFromFetch => {
						// Put a copy in the cache
						const copy = responseFromFetch.clone();
						fetchEvent.waitUntil(
							caches.open(pagesCacheName)
							.then( pagesCache => {
								return pagesCache.put(request, copy);
							}) // end open then
						); // end waitUntil
						return responseFromFetch;
					}) // end fetch then
					.catch( error => {
						// Otherwise show the fallback page
						return caches.match('/offline.html');
					}); // end fetch catch and return
				}) // end match then
			); // end respondWith
			return; // Go no further
		} // end if

		fetchEvent.respondWith(
		// Otherwise fetch the page from the network
			fetch(request)
			.then( responseFromFetch => {
				// Put a copy in the cache
				const copy = responseFromFetch.clone();
				fetchEvent.waitUntil(
					caches.open(pagesCacheName)
					.then( pagesCache => {
						return pagesCache.put(request, copy);
					}) // end open then
				); // end waitUntil
				return responseFromFetch;
			}) // end fetch then
			.catch( error => {
				// Otherwise look for a cached version of the page
				return caches.match(request)
				.then( responseFromCache => {
					if (responseFromCache) {
						return responseFromCache;
					} // end if
				// Otherwise show the fallback page
				return caches.match('/offline.html');
				}); // end match then and return
			}) // end fetch catch
		); // end respondWith
		return; // Go no further
	} // end if

	// When the user requests an image
	if (request.headers.get('Accept').includes('image')) {
		fetchEvent.respondWith(
			// Look for a cached version of the image
			caches.match(request)
			.then( responseFromCache => {
				if (responseFromCache) {
					// Fetch a fresh version from the network
					fetchEvent.waitUntil(
						fetch(request)
						.then( responseFromFetch => {
							//Update the cache
							caches.open(imageCacheName)
							.then( imageCache => {
								return imageCache.put(request, responseFromFetch);
							}); // end open then
						}) // end fetch then
					); // end waitUntil
					return responseFromCache;
				} // end if
				// Otherwise fetch the image from the network
				return fetch(request)
				.then( responseFromFetch => {
					// Put a copy in the cache
					const copy = responseFromFetch.clone();
					fetchEvent.waitUntil(
						caches.open(imageCacheName)
						.then( imageCache => {
							return imageCache.put(request, copy);
						}) // end open then
					); // end waitUntil
					return responseFromFetch;
				}) // end fetch then and return
				.catch( error => {
					// Otherwise show a fallback image
					return caches.match('fallback.svg');
				}); // end fetch catch and return
			}) // end match then
		); // end respondWith
		return; // Go no further
	} // end if

	// For everything else...
	fetchEvent.respondWith(
		// Look for a cached copy of the file
		caches.match(request)
		.then( responseFromCache => {
			if (responseFromCache) {
				return responseFromCache;
			} // end if
			// Otherwise fetch the file from the network
			return fetch(request);
		}) // end match then
	); // end respondWith

}); // end addEventListner

addEventListener('activate', activateEvent => {
	activateEvent.waitUntil(
		caches.keys()
		.then( cacheNames => {
			return Promise.all(
				cacheNames.map( cacheName => {
					if (!cacheList.includes(cacheName)) {
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