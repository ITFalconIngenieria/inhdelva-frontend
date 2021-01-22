const menu = [
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
        titulo: 'Facturas',
        icon: 'file-text',
        submenu: [
            { titulo: 'Facturas generadas', url: '/facturasGeneradas' },
            { titulo: 'Facturas emitidas', url: '/facturasEmitidas' },
            { titulo: 'Facturas canceladas', url: '/facturasCanceladas' },
        ]
    },
    {
        titulo: 'Reportes',
        icon: 'bar-chart',
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