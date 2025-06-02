/* eslint-disable @typescript-eslint/no-explicit-any */


export function generatePageTitle(title: string) {
    return title.concat(" | Restful NE")
}

export const getObjValue = (key: string | number, obj: any) => {
    const keys = key.toString().split('.');
    let result = obj;
    for (const key of keys) {
        if (result && Object.prototype.hasOwnProperty.call(result, key)) {
            result = result[key];
        } else {
            return undefined;
        }
    }
    return result as string;
};

export const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

export const getCookie = (name: string) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return '';
};

export const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const formatPathname = (pathname: string) => {
    const path = pathname.replace('/', '');
    if (path === '') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1);
};

/* 
    Format the username to be more user-friendly
  */
export const formatUsername = (firstName?: string, lastName?: string) => {
    return `${firstName} ${lastName}`;
}

/* 
    Format the avatar initials for advanced UI
  */
export const formatAvatarInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`;
}


export const paginate = (data: any[], pageSize: number, currentPage: number) => {
    const offset = (currentPage - 1) * pageSize;
    return data.slice(offset, offset + pageSize);
};