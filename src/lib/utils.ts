import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Utils for api.ts
 */

export function is_safari() {
	// Detect Chrome
	let chrome_agent = navigator.userAgent.indexOf("Chrome") > -1;
	// Detect Safari
	let safari_agent = navigator.userAgent.indexOf("Safari") > -1;
	// Discard Safari since it also matches Chrome
	if ((chrome_agent) && (safari_agent)) safari_agent = false;
	return safari_agent;
}
  
export function classNames(...classes: (string | boolean | undefined)[]): string {
	return classes.filter(Boolean).join(' ');
}

// We don't use "_" and "-" for better readability
const _nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 21);

export function nanoid() {
	return _nanoid();
}
  
export function formatDate(dateString: string, withTime: boolean): string {
	const date = new Date(dateString);
	const now = new Date();
  
	if (withTime) {
	  	if (date.toDateString() === now.toDateString()) {
			return date.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: 'numeric',
				hour12: true,
			});
		} else {
			const options: Intl.DateTimeFormatOptions = {
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				hour12: true,
			};
			if (date.getFullYear() !== now.getFullYear()) {
				options.year = 'numeric';
			}
			return date.toLocaleDateString('en-US', options);
		}
	} else {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}
}

// export function debounce(node: HTMLElement, params: { func: () => void; duration: number }) {
// 	let timer: number;
  
// 	const handler = () => {
// 		clearTimeout(timer);
// 		timer = window.setTimeout(() => {
// 			params.func();
// 		}, params.duration);
// 	};
  
// 	node.addEventListener('input', handler);
  
// 	return {
// 		update(newParams: { func: () => void; duration: number }) {
// 			params = newParams;
// 		},
// 	  	destroy() {
// 			clearTimeout(timer);
// 			node.removeEventListener('input', handler);
// 		},
// 	};
// }
export function debounce<T>(node: HTMLElement, params: { value: T; func: () => void; duration: number }) {
    let timer: ReturnType<typeof setTimeout>;

    return {
        update(newParams: { value: T; func: () => void; duration: number }) {
            // Solo ejecutar el debounce si el valor ha cambiado
            if (newParams.value !== params.value) {
                clearTimeout(timer);
                timer = setTimeout(newParams.func, newParams.duration);
            }
            params = newParams;
        },
        destroy() {
            clearTimeout(timer);
        }
    };
}

export function extractTeaser(body: HTMLElement): string {
	const paragraphs = Array.from(body.querySelectorAll('p'));
	const teaser = paragraphs.map((p) => p.textContent).join(' ');
	return teaser.length > 512 ? `${teaser.slice(0, 512)}…` : teaser;
}

export function resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number, contentType: string): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
	
		reader.onload = (event) => {
			const image = new Image();
			image.src = event.target?.result as string;
	
			image.onload = () => {
			let { width, height } = image;
	
			if (width > maxWidth) {
				height = (height * maxWidth) / width;
				width = maxWidth;
			}
			if (height > maxHeight) {
				width = (width * maxHeight) / height;
				height = maxHeight;
			}
	
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const context = canvas.getContext('2d');
	
			if (context) {
				context.drawImage(image, 0, 0, width, height);
				canvas.toBlob(
				(blob) => {
					if (blob) {
					resolve(blob);
					} else {
					reject(new Error('Canvas is empty'));
					}
				},
				contentType,
				quality
				);
			} else {
				reject(new Error('Canvas context is not available'));
			}
			};
	
			image.onerror = (error) => {
			reject(error);
			};
		};
	
		reader.onerror = (error) => {
			reject(error);
		};
	
		reader.readAsDataURL(file);
	});
}
  
/**
 * Get image dimensions from a file
 */

export async function getDimensions(file: File): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
	  	const img = new Image();
  
		img.onload = function () {
			resolve({ width: img.width, height: img.height });
		};
  
		img.onerror = function (error) {
			reject(error);
		};
  
	  	img.src = URL.createObjectURL(file);
	});
}

export async function fetchJSON<T>(method: string, url: string, data?: any
): Promise<T> {
	const response = await fetch(url, {
		method,
		body: data ? JSON.stringify(data) : undefined,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error(response.statusText);
	return response.json();
}