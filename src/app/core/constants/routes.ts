export const PATH = {
	HOME: 'home',
	EDITOR: 'map-editor',
  ABOUT: 'about',
}

export const ROUTES = [
	{
		label: 'Inicio',
		path: `/${PATH.HOME}`,
	},
	{
		label: 'Editor POIs',
		path: `/${PATH.EDITOR}`,
	},
	{
		label: 'Acerca de',
		path: `/${PATH.ABOUT}`,
	},

];

export const PRIVATES_ROUTES = ROUTES.map((route) => route.path)
