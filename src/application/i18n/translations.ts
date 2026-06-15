export type TranslationKey =
  | 'app.title'
  | 'app.tagline'
  | 'login.title'
  | 'login.subtitle'
  | 'login.selectRole'
  | 'login.supervisor'
  | 'login.supervisorDesc'
  | 'login.housekeeper'
  | 'login.housekeeperDesc'
  | 'login.selectPerson'
  | 'login.back'
  | 'login.loginAs'
  | 'nav.dashboard'
  | 'nav.myRooms'
  | 'nav.logout'
  | 'nav.language'
  | 'stats.total'
  | 'stats.vacantDirty'
  | 'stats.checkout'
  | 'stats.checkinPending'
  | 'stats.occupiedDirty'
  | 'stats.clean'
  | 'stats.inspected'
  | 'stats.dnd'
  | 'stats.outOfOrder'
  | 'stats.assigned'
  | 'stats.unassigned'
  | 'filter.allFloors'
  | 'filter.allStatuses'
  | 'filter.allTypes'
  | 'filter.allHousekeepers'
  | 'filter.search'
  | 'filter.floor'
  | 'filter.status'
  | 'filter.type'
  | 'filter.assignedTo'
  | 'filter.clearFilters'
  | 'action.loadRooms'
  | 'action.addRoom'
  | 'action.save'
  | 'action.cancel'
  | 'action.delete'
  | 'action.edit'
  | 'action.assign'
  | 'action.markClean'
  | 'action.markDnd'
  | 'action.markCheckinReady'
  | 'action.markInspected'
  | 'action.priorityUp'
  | 'action.priorityDown'
  | 'action.refresh'
  | 'action.resetDay'
  | 'action.generate'
  | 'room.number'
  | 'room.floor'
  | 'room.type'
  | 'room.status'
  | 'room.assignedTo'
  | 'room.notes'
  | 'room.guestName'
  | 'room.checkinTime'
  | 'room.lastUpdated'
  | 'room.beds'
  | 'room.priority'
  | 'room.unassigned'
  | 'room.noNotes'
  | 'room.details'
  | 'room.updateStatus'
  | 'room.assignHousekeeper'
  | 'room.notesPlaceholder'
  | 'load.title'
  | 'load.subtitle'
  | 'load.floorNumber'
  | 'load.startRoom'
  | 'load.roomCount'
  | 'load.addFloor'
  | 'load.removeFloor'
  | 'load.preview'
  | 'load.totalRooms'
  | 'load.replaceWarning'
  | 'load.appendMode'
  | 'load.replaceMode'
  | 'load.generate'
  | 'hk.myAssignments'
  | 'hk.noAssignments'
  | 'hk.noAssignmentsDesc'
  | 'hk.floor'
  | 'hk.priority'
  | 'hk.allDone'
  | 'hk.allDoneDesc'
  | 'msg.roomUpdated'
  | 'msg.roomsGenerated'
  | 'msg.confirmReset'
  | 'msg.noRooms'
  | 'msg.noRoomsDesc'
  | 'staff.title'
  | 'staff.manageTeam'
  | 'staff.supervisors'
  | 'staff.housekeepers'
  | 'staff.addSupervisor'
  | 'staff.addHousekeeper'
  | 'staff.namePlaceholder'
  | 'staff.addBtn'
  | 'staff.editName'
  | 'staff.saveName'
  | 'staff.deleteConfirm'
  | 'staff.deleteWarning'
  | 'staff.roomsAssigned'
  | 'staff.noSupervisors'
  | 'staff.noHousekeepers'
  | 'room.addTitle'
  | 'room.editTitle'
  | 'room.floorHint'
  | 'room.initialStatus'
  | 'action.readyForInspection'
  | 'action.supervisorOnly'
  | 'login.email'
  | 'login.password'
  | 'login.signIn'
  | 'login.firstRun'
  | 'login.createAdmin'
  | 'login.creating'
  | 'login.signingIn'
  | 'admin.title'
  | 'admin.users'
  | 'admin.createUser'
  | 'admin.name'
  | 'admin.email'
  | 'admin.password'
  | 'admin.role'
  | 'admin.createBtn'
  | 'admin.deleteConfirm'
  | 'admin.deleteWarning'
  | 'admin.back'
  | 'admin.noUsers'
  | 'admin.editRole'

type Translations = Record<TranslationKey, string>

export const en: Translations = {
  'app.title': 'HouseKeeper Pro',
  'app.tagline': 'Hotel Housekeeping Management',
  'login.title': 'HouseKeeper Pro',
  'login.subtitle': 'Hotel Housekeeping Management System',
  'login.selectRole': 'Select your role to continue',
  'login.supervisor': 'Supervisor',
  'login.supervisorDesc': 'Manage rooms, assign staff, and monitor progress',
  'login.housekeeper': 'Housekeeper',
  'login.housekeeperDesc': 'View assigned rooms and update status',
  'login.selectPerson': 'Who are you?',
  'login.back': 'Back',
  'login.loginAs': 'Login as',
  'nav.dashboard': 'Dashboard',
  'nav.myRooms': 'My Rooms',
  'nav.logout': 'Logout',
  'nav.language': 'PT',
  'stats.total': 'Total Rooms',
  'stats.vacantDirty': 'Vacant Dirty',
  'stats.checkout': 'Checkout',
  'stats.checkinPending': 'Check-in Pending',
  'stats.occupiedDirty': 'Occupied Dirty',
  'stats.clean': 'Clean',
  'stats.inspected': 'Inspected',
  'stats.dnd': 'DND',
  'stats.outOfOrder': 'Out of Order',
  'stats.assigned': 'Assigned',
  'stats.unassigned': 'Unassigned',
  'filter.allFloors': 'All Floors',
  'filter.allStatuses': 'All Statuses',
  'filter.allTypes': 'All Types',
  'filter.allHousekeepers': 'All Housekeepers',
  'filter.search': 'Search rooms...',
  'filter.floor': 'Floor',
  'filter.status': 'Status',
  'filter.type': 'Type',
  'filter.assignedTo': 'Assigned To',
  'filter.clearFilters': 'Clear Filters',
  'action.loadRooms': 'Load Rooms',
  'action.addRoom': 'Add Room',
  'action.save': 'Save',
  'action.cancel': 'Cancel',
  'action.delete': 'Delete',
  'action.edit': 'Edit',
  'action.assign': 'Assign',
  'action.markClean': 'Ready for Inspection',
  'action.markDnd': 'DND',
  'action.markCheckinReady': 'Check-in Ready',
  'action.markInspected': 'Mark Inspected',
  'action.priorityUp': 'Move Up',
  'action.priorityDown': 'Move Down',
  'action.refresh': 'Refresh',
  'action.resetDay': 'Reset Day',
  'action.generate': 'Generate Rooms',
  'room.number': 'Room Number',
  'room.floor': 'Floor',
  'room.type': 'Room Type',
  'room.status': 'Status',
  'room.assignedTo': 'Assigned To',
  'room.notes': 'Notes',
  'room.guestName': 'Guest Name',
  'room.checkinTime': 'Check-in Time',
  'room.lastUpdated': 'Last Updated',
  'room.beds': 'Beds',
  'room.priority': 'Priority',
  'room.unassigned': 'Unassigned',
  'room.noNotes': 'No notes',
  'room.details': 'Room Details',
  'room.updateStatus': 'Update Status',
  'room.assignHousekeeper': 'Assign Housekeeper',
  'room.notesPlaceholder': 'Add notes for this room...',
  'load.title': 'Load Rooms',
  'load.subtitle': 'Configure hotel floors and room layout for today\'s shift',
  'load.floorNumber': 'Floor',
  'load.startRoom': 'Start Room #',
  'load.roomCount': 'Number of Rooms',
  'load.addFloor': '+ Add Floor',
  'load.removeFloor': 'Remove',
  'load.preview': 'Preview',
  'load.totalRooms': 'Total rooms to generate',
  'load.replaceWarning': 'This will replace all existing rooms.',
  'load.appendMode': 'Append to existing rooms',
  'load.replaceMode': 'Replace all rooms',
  'load.generate': 'Generate Rooms',
  'hk.myAssignments': 'My Assignments',
  'hk.noAssignments': 'No rooms assigned',
  'hk.noAssignmentsDesc': 'Ask your supervisor to assign rooms to you.',
  'hk.floor': 'Floor',
  'hk.priority': 'Priority',
  'hk.allDone': 'All done!',
  'hk.allDoneDesc': 'All your rooms have been serviced.',
  'msg.roomUpdated': 'Room updated successfully',
  'msg.roomsGenerated': 'Rooms generated successfully',
  'msg.confirmReset': 'Are you sure you want to reset all rooms for today? This cannot be undone.',
  'msg.noRooms': 'No rooms found',
  'msg.noRoomsDesc': 'Use "Load Rooms" to set up the hotel rooms for today\'s shift.',
  'staff.title': 'Manage Team',
  'staff.manageTeam': 'Team',
  'staff.supervisors': 'Supervisors',
  'staff.housekeepers': 'Housekeepers',
  'staff.addSupervisor': 'Add supervisor',
  'staff.addHousekeeper': 'Add housekeeper',
  'staff.namePlaceholder': 'Full name',
  'staff.addBtn': 'Add',
  'staff.editName': 'Edit name',
  'staff.saveName': 'Save',
  'staff.deleteConfirm': 'Remove this person from the team?',
  'staff.deleteWarning': 'Their assigned rooms will become unassigned.',
  'staff.roomsAssigned': 'rooms',
  'staff.noSupervisors': 'No supervisors registered.',
  'staff.noHousekeepers': 'No housekeepers registered.',
  'room.addTitle': 'Add Room',
  'room.editTitle': 'Edit Room',
  'room.floorHint': 'Auto-calculated from number',
  'room.initialStatus': 'Initial Status',
  'action.readyForInspection': 'Ready for Inspection',
  'action.supervisorOnly': 'Supervisor only',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.signIn': 'Sign In',
  'login.firstRun': 'Welcome! Create your admin account to get started.',
  'login.createAdmin': 'Create Admin Account',
  'login.creating': 'Creating account...',
  'login.signingIn': 'Signing in...',
  'admin.title': 'Admin Panel',
  'admin.users': 'Users',
  'admin.createUser': 'Create User',
  'admin.name': 'Full Name',
  'admin.email': 'Email',
  'admin.password': 'Password',
  'admin.role': 'Role',
  'admin.createBtn': 'Create',
  'admin.deleteConfirm': 'Remove this user?',
  'admin.deleteWarning': 'They will no longer be able to log in.',
  'admin.back': 'Back to Dashboard',
  'admin.noUsers': 'No users yet.',
  'admin.editRole': 'Change Role',
}

export const pt: Translations = {
  'app.title': 'HouseKeeper Pro',
  'app.tagline': 'Gestão de Camareiras do Hotel',
  'login.title': 'HouseKeeper Pro',
  'login.subtitle': 'Sistema de Gestão de Camareiras',
  'login.selectRole': 'Selecione seu cargo para continuar',
  'login.supervisor': 'Supervisora',
  'login.supervisorDesc': 'Gerenciar quartos, atribuir equipe e monitorar progresso',
  'login.housekeeper': 'Camareira',
  'login.housekeeperDesc': 'Visualizar quartos atribuídos e atualizar status',
  'login.selectPerson': 'Quem é você?',
  'login.back': 'Voltar',
  'login.loginAs': 'Entrar como',
  'nav.dashboard': 'Painel',
  'nav.myRooms': 'Meus Quartos',
  'nav.logout': 'Sair',
  'nav.language': 'EN',
  'stats.total': 'Total de Quartos',
  'stats.vacantDirty': 'Vago Sujo',
  'stats.checkout': 'Checkout',
  'stats.checkinPending': 'Check-in Pendente',
  'stats.occupiedDirty': 'Ocupado Sujo',
  'stats.clean': 'Limpo',
  'stats.inspected': 'Inspecionado',
  'stats.dnd': 'NPD',
  'stats.outOfOrder': 'Fora de Serviço',
  'stats.assigned': 'Atribuídos',
  'stats.unassigned': 'Não Atribuídos',
  'filter.allFloors': 'Todos os Andares',
  'filter.allStatuses': 'Todos os Status',
  'filter.allTypes': 'Todos os Tipos',
  'filter.allHousekeepers': 'Todas as Camareiras',
  'filter.search': 'Buscar quartos...',
  'filter.floor': 'Andar',
  'filter.status': 'Status',
  'filter.type': 'Tipo',
  'filter.assignedTo': 'Atribuído a',
  'filter.clearFilters': 'Limpar Filtros',
  'action.loadRooms': 'Carregar Quartos',
  'action.addRoom': 'Adicionar Quarto',
  'action.save': 'Salvar',
  'action.cancel': 'Cancelar',
  'action.delete': 'Excluir',
  'action.edit': 'Editar',
  'action.assign': 'Atribuir',
  'action.markClean': 'Pronto p/ Inspeção',
  'action.markDnd': 'Não Perturbe',
  'action.markCheckinReady': 'Pronto p/ Check-in',
  'action.markInspected': 'Marcar Inspecionado',
  'action.priorityUp': 'Subir Prioridade',
  'action.priorityDown': 'Baixar Prioridade',
  'action.refresh': 'Atualizar',
  'action.resetDay': 'Reiniciar Dia',
  'action.generate': 'Gerar Quartos',
  'room.number': 'Número do Quarto',
  'room.floor': 'Andar',
  'room.type': 'Tipo de Quarto',
  'room.status': 'Status',
  'room.assignedTo': 'Atribuído a',
  'room.notes': 'Observações',
  'room.guestName': 'Nome do Hóspede',
  'room.checkinTime': 'Horário do Check-in',
  'room.lastUpdated': 'Última Atualização',
  'room.beds': 'Camas',
  'room.priority': 'Prioridade',
  'room.unassigned': 'Não Atribuído',
  'room.noNotes': 'Sem observações',
  'room.details': 'Detalhes do Quarto',
  'room.updateStatus': 'Atualizar Status',
  'room.assignHousekeeper': 'Atribuir Camareira',
  'room.notesPlaceholder': 'Adicionar observações para este quarto...',
  'load.title': 'Carregar Quartos',
  'load.subtitle': 'Configure os andares e a distribuição dos quartos para o turno de hoje',
  'load.floorNumber': 'Andar',
  'load.startRoom': 'Primeiro Quarto Nº',
  'load.roomCount': 'Número de Quartos',
  'load.addFloor': '+ Adicionar Andar',
  'load.removeFloor': 'Remover',
  'load.preview': 'Prévia',
  'load.totalRooms': 'Total de quartos a gerar',
  'load.replaceWarning': 'Isso vai substituir todos os quartos existentes.',
  'load.appendMode': 'Adicionar aos quartos existentes',
  'load.replaceMode': 'Substituir todos os quartos',
  'load.generate': 'Gerar Quartos',
  'hk.myAssignments': 'Meus Quartos',
  'hk.noAssignments': 'Nenhum quarto atribuído',
  'hk.noAssignmentsDesc': 'Peça à sua supervisora para atribuir quartos a você.',
  'hk.floor': 'Andar',
  'hk.priority': 'Prioridade',
  'hk.allDone': 'Tudo feito!',
  'hk.allDoneDesc': 'Todos os seus quartos foram atendidos.',
  'msg.roomUpdated': 'Quarto atualizado com sucesso',
  'msg.roomsGenerated': 'Quartos gerados com sucesso',
  'msg.confirmReset': 'Tem certeza que deseja reiniciar todos os quartos do dia? Esta ação não pode ser desfeita.',
  'msg.noRooms': 'Nenhum quarto encontrado',
  'msg.noRoomsDesc': 'Use "Carregar Quartos" para configurar os quartos do hotel para o turno de hoje.',
  'staff.title': 'Gerenciar Equipe',
  'staff.manageTeam': 'Equipe',
  'staff.supervisors': 'Supervisoras',
  'staff.housekeepers': 'Camareiras',
  'staff.addSupervisor': 'Adicionar supervisora',
  'staff.addHousekeeper': 'Adicionar camareira',
  'staff.namePlaceholder': 'Nome completo',
  'staff.addBtn': 'Adicionar',
  'staff.editName': 'Editar nome',
  'staff.saveName': 'Salvar',
  'staff.deleteConfirm': 'Remover esta pessoa da equipe?',
  'staff.deleteWarning': 'Os quartos atribuídos a ela ficarão sem responsável.',
  'staff.roomsAssigned': 'quartos',
  'staff.noSupervisors': 'Nenhuma supervisora cadastrada.',
  'staff.noHousekeepers': 'Nenhuma camareira cadastrada.',
  'room.addTitle': 'Adicionar Quarto',
  'room.editTitle': 'Editar Quarto',
  'room.floorHint': 'Calculado automaticamente do número',
  'room.initialStatus': 'Status Inicial',
  'action.readyForInspection': 'Pronto p/ Inspeção',
  'action.supervisorOnly': 'Apenas supervisor',
  'login.email': 'Email',
  'login.password': 'Senha',
  'login.signIn': 'Entrar',
  'login.firstRun': 'Bem-vindo! Crie sua conta de administrador para começar.',
  'login.createAdmin': 'Criar Conta Admin',
  'login.creating': 'Criando conta...',
  'login.signingIn': 'Entrando...',
  'admin.title': 'Painel Admin',
  'admin.users': 'Usuários',
  'admin.createUser': 'Criar Usuário',
  'admin.name': 'Nome Completo',
  'admin.email': 'Email',
  'admin.password': 'Senha',
  'admin.role': 'Cargo',
  'admin.createBtn': 'Criar',
  'admin.deleteConfirm': 'Remover este usuário?',
  'admin.deleteWarning': 'Ele não poderá mais fazer login.',
  'admin.back': 'Voltar ao Painel',
  'admin.noUsers': 'Nenhum usuário cadastrado.',
  'admin.editRole': 'Alterar Cargo',
}

export const es: Translations = {
  'app.title': 'HouseKeeper Pro',
  'app.tagline': 'Gestión de Camareras del Hotel',
  'login.title': 'HouseKeeper Pro',
  'login.subtitle': 'Sistema de Gestión de Camareras',
  'login.selectRole': 'Seleccione su cargo para continuar',
  'login.supervisor': 'Supervisora',
  'login.supervisorDesc': 'Gestionar habitaciones, asignar personal y monitorear el progreso',
  'login.housekeeper': 'Camarera',
  'login.housekeeperDesc': 'Ver habitaciones asignadas y actualizar el estado',
  'login.selectPerson': '¿Quién eres tú?',
  'login.back': 'Volver',
  'login.loginAs': 'Entrar como',
  'nav.dashboard': 'Panel',
  'nav.myRooms': 'Mis Habitaciones',
  'nav.logout': 'Salir',
  'nav.language': 'EN',
  'stats.total': 'Total de Habitaciones',
  'stats.vacantDirty': 'Vacante Sucia',
  'stats.checkout': 'Checkout',
  'stats.checkinPending': 'Check-in Pendiente',
  'stats.occupiedDirty': 'Ocupado Sucio',
  'stats.clean': 'Limpia',
  'stats.inspected': 'Inspeccionada',
  'stats.dnd': 'NMO',
  'stats.outOfOrder': 'Fuera de Servicio',
  'stats.assigned': 'Asignadas',
  'stats.unassigned': 'Sin Asignar',
  'filter.allFloors': 'Todos los Pisos',
  'filter.allStatuses': 'Todos los Estados',
  'filter.allTypes': 'Todos los Tipos',
  'filter.allHousekeepers': 'Todas las Camareras',
  'filter.search': 'Buscar habitaciones...',
  'filter.floor': 'Piso',
  'filter.status': 'Estado',
  'filter.type': 'Tipo',
  'filter.assignedTo': 'Asignada a',
  'filter.clearFilters': 'Limpiar Filtros',
  'action.loadRooms': 'Cargar Habitaciones',
  'action.addRoom': 'Agregar Habitación',
  'action.save': 'Guardar',
  'action.cancel': 'Cancelar',
  'action.delete': 'Eliminar',
  'action.edit': 'Editar',
  'action.assign': 'Asignar',
  'action.markClean': 'Lista p/ Inspección',
  'action.markDnd': 'No Molestar',
  'action.markCheckinReady': 'Lista p/ Check-in',
  'action.markInspected': 'Marcar Inspeccionada',
  'action.priorityUp': 'Subir Prioridad',
  'action.priorityDown': 'Bajar Prioridad',
  'action.refresh': 'Actualizar',
  'action.resetDay': 'Reiniciar Día',
  'action.generate': 'Generar Habitaciones',
  'room.number': 'Número de Habitación',
  'room.floor': 'Piso',
  'room.type': 'Tipo de Habitación',
  'room.status': 'Estado',
  'room.assignedTo': 'Asignada a',
  'room.notes': 'Notas',
  'room.guestName': 'Nombre del Huésped',
  'room.checkinTime': 'Hora de Check-in',
  'room.lastUpdated': 'Última Actualización',
  'room.beds': 'Camas',
  'room.priority': 'Prioridad',
  'room.unassigned': 'Sin Asignar',
  'room.noNotes': 'Sin notas',
  'room.details': 'Detalles de la Habitación',
  'room.updateStatus': 'Actualizar Estado',
  'room.assignHousekeeper': 'Asignar Camarera',
  'room.notesPlaceholder': 'Agregar notas para esta habitación...',
  'load.title': 'Cargar Habitaciones',
  'load.subtitle': 'Configure los pisos y la distribución de habitaciones para el turno de hoy',
  'load.floorNumber': 'Piso',
  'load.startRoom': 'Primera Hab. Nº',
  'load.roomCount': 'Número de Habitaciones',
  'load.addFloor': '+ Agregar Piso',
  'load.removeFloor': 'Eliminar',
  'load.preview': 'Vista previa',
  'load.totalRooms': 'Total de habitaciones a generar',
  'load.replaceWarning': 'Esto reemplazará todas las habitaciones existentes.',
  'load.appendMode': 'Agregar a las habitaciones existentes',
  'load.replaceMode': 'Reemplazar todas las habitaciones',
  'load.generate': 'Generar Habitaciones',
  'hk.myAssignments': 'Mis Habitaciones',
  'hk.noAssignments': 'Sin habitaciones asignadas',
  'hk.noAssignmentsDesc': 'Pida a su supervisora que le asigne habitaciones.',
  'hk.floor': 'Piso',
  'hk.priority': 'Prioridad',
  'hk.allDone': '¡Todo listo!',
  'hk.allDoneDesc': 'Todas sus habitaciones han sido atendidas.',
  'msg.roomUpdated': 'Habitación actualizada correctamente',
  'msg.roomsGenerated': 'Habitaciones generadas correctamente',
  'msg.confirmReset': '¿Está segura de que desea reiniciar todas las habitaciones del día? Esta acción no se puede deshacer.',
  'msg.noRooms': 'No se encontraron habitaciones',
  'msg.noRoomsDesc': 'Use "Cargar Habitaciones" para configurar las habitaciones del hotel para el turno de hoy.',
  'staff.title': 'Gestionar Personal',
  'staff.manageTeam': 'Personal',
  'staff.supervisors': 'Supervisoras',
  'staff.housekeepers': 'Camareras',
  'staff.addSupervisor': 'Agregar supervisora',
  'staff.addHousekeeper': 'Agregar camarera',
  'staff.namePlaceholder': 'Nombre completo',
  'staff.addBtn': 'Agregar',
  'staff.editName': 'Editar nombre',
  'staff.saveName': 'Guardar',
  'staff.deleteConfirm': '¿Eliminar esta persona del equipo?',
  'staff.deleteWarning': 'Sus habitaciones asignadas quedarán sin responsable.',
  'staff.roomsAssigned': 'habitaciones',
  'staff.noSupervisors': 'No hay supervisoras registradas.',
  'staff.noHousekeepers': 'No hay camareras registradas.',
  'room.addTitle': 'Agregar Habitación',
  'room.editTitle': 'Editar Habitación',
  'room.floorHint': 'Calculado automáticamente del número',
  'room.initialStatus': 'Estado Inicial',
  'action.readyForInspection': 'Lista p/ Inspección',
  'action.supervisorOnly': 'Solo supervisor',
  'login.email': 'Correo',
  'login.password': 'Contraseña',
  'login.signIn': 'Ingresar',
  'login.firstRun': '¡Bienvenido! Crea tu cuenta de administrador para comenzar.',
  'login.createAdmin': 'Crear Cuenta Admin',
  'login.creating': 'Creando cuenta...',
  'login.signingIn': 'Ingresando...',
  'admin.title': 'Panel Admin',
  'admin.users': 'Usuarios',
  'admin.createUser': 'Crear Usuario',
  'admin.name': 'Nombre Completo',
  'admin.email': 'Correo',
  'admin.password': 'Contraseña',
  'admin.role': 'Cargo',
  'admin.createBtn': 'Crear',
  'admin.deleteConfirm': '¿Eliminar este usuario?',
  'admin.deleteWarning': 'Ya no podrá iniciar sesión.',
  'admin.back': 'Volver al Panel',
  'admin.noUsers': 'No hay usuarios aún.',
  'admin.editRole': 'Cambiar Cargo',
}

export const translations = { en, pt, es }
