const menu = [
    {
        titulo: 'Inicio',
        icon: 'home',
        url: '/inicio', 
        acceso: true
    },
    {
        titulo: 'Mantenimiento',
        icon: 'tool',
        acceso: false,
        submenu: [
            { titulo: 'Usuarios', url: '/usuarios' },
            { titulo: 'Clientes', url: '/clientes' },
            { titulo: 'Proveedores', url: '/proveedores' },
            { titulo: 'Zonas', url: '/localizacion' },
            { titulo: 'Medidores', url: '/medidores' },
            { titulo: 'Bloques Horarios', url: '/bloquesHorarios' },
        ]
    },
    {
        titulo: 'Tarifa',
        icon: 'calculator',
        url: '/tipoTarifa',
        acceso: false
    },
    {
        titulo: 'Parámetros de entrada',
        icon: 'control',
        url: '/parametrosEntrada',
        acceso: false
    },
    {
        titulo: 'Contratos',
        icon: 'book',
        url: '/contratos',
        acceso: false
    },
    {
        titulo: 'Matriz Energética',
        icon: 'pie-chart',
        url: '/matrizEnergetica',
        acceso: false
    },
    {
        titulo: 'Facturación',
        icon: 'profile',
        acceso: false,
        submenu: [
            { titulo: 'Cargos especiales', url: '/cargosEspeciales' }
        ]
    },
    {
        titulo: 'Facturas',
        icon: 'file-text',
        acceso: false,
        submenu: [
            { titulo: 'Facturas generadas', url: '/facturasGeneradas' },
            { titulo: 'Facturas emitidas', url: '/facturasEmitidas' },
            { titulo: 'Facturas canceladas', url: '/facturasCanceladas' },
        ]
    },
    {
        titulo: 'Reportes',
        icon: 'bar-chart',
        acceso: false,
        submenu: [
            { titulo: 'Reporte producción', url: '/reporteProduccion' },
            { titulo: 'Reporte proveedores de energía', url: '/reporteProveedores' },
            { titulo: 'Reporte facturación', url: '/reporteFacturacion' },
            { titulo: 'Reporte validación', url: '/reporteValidacion' },
        ]
    },
    {
        titulo: 'Configuración',
        icon: 'setting',
        acceso: false,
        submenu: [
            { titulo: 'Rango factura', url: '/rangoFactura' }
        ]
    },
    {
        titulo: 'Cerrar sesión',
        icon: 'logout',
        url: '/ayuda',
        acceso: true
    },
    {
        titulo: 'Ayuda',
        icon: 'question-circle',
        url: '/ayuda',
        acceso: true
    }
]
//
const menu2 = [
    {
        titulo: 'Inicio',
        icon: 'home',
        url: '/inicio'
    },
    {
        titulo: 'Mantenimiento',
        icon: 'tool',
        submenu: [
            { titulo: 'Usuarios', url: '/usuarios' },
            { titulo: 'Clientes', url: '/clientes' },
            { titulo: 'Proveedores', url: '/proveedores' },
            { titulo: 'Zonas', url: '/localizacion' },
            { titulo: 'Medidores', url: '/medidores' },
            { titulo: 'Bloques Horarios', url: '/bloquesHorarios' },
        ]
    },
    {
        titulo: 'Tarifa',
        icon: 'calculator',
        url: '/tipoTarifa'
    },
    {
        titulo: 'Parámetros de entrada',
        icon: 'control',
        url: '/parametrosEntrada'
    },
    {
        titulo: 'Contratos',
        icon: 'book',
        url: '/contratos'
    },
    {
        titulo: 'Matriz Energética',
        icon: 'pie-chart',
        url: '/matrizEnergetica'
    },
    {
        titulo: 'Facturación',
        icon: 'profile',
        submenu: [
            { titulo: 'Cargos especiales', url: '/cargosEspeciales' }
        ]
    },
    {
        titulo: 'Configuración',
        icon: 'setting',
        submenu: [
            { titulo: 'Rango factura', url: '/rangoFactura' },
            { titulo: 'Opcion 2', url: '' },
            { titulo: 'Cerrar sesión', url: '' }
        ]
    },
    {
        titulo: 'Ayuda',
        icon: 'question-circle',
        url: '/ayuda'
    }
]