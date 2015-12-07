let LIST =  [
	{
		id: 1,
		name: 'Крылатское маршрут 1 (ПУ-зима)',
		image: '/images/routes/1_zima.jpg',
		odhs: []
	},
	{
		id:2,
		name: 'Крылатское маршрут 2 (ПЩ-зима)',
		image: '/images/routes/2_zima_psch.jpg',
		odhs: [10000259,10005327,10000260,10005328,10005332,10000257,10000262,10000272,10000258,10000261,10005331,10005330]
	},
	{
		id: 3,
		name: 'Крылатское маршрут 4 (зима)',
		image: '/images/routes/4_zima.jpg',
		odhs: []
	}
]


_.each( LIST, (v) => {
	v.label = v.name;
	v.value = v.id
})

export default LIST;