export type Church = {
    church_id: number;
    churchname: string;
    churchphone: string;
    address: string;
    postalcode: string;
    city: string;
}

export type ChurchMember = {
    member_id: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Sex: 'M' | 'F';
    email: string;
    phone: string;
    activity_status: 'active' | 'inactive';
    church_id: number;
    church_join_date: string;
}

export type Admin = {
    admin_id: number;
    adminusername: string;
    adminpassword: string;
    date_started: Date;
    ministry_id: number;
    superadmin_id: number;
}