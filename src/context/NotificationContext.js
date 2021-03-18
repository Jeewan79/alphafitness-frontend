import { createContext } from 'react';

export const NotificationContext = createContext({
	notify: false,
	message: null,
	error: false,
	showNotification: () => {},
	clearNotification: () => {}
});
