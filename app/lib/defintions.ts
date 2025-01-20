export type Church = {
    church_id: number;
    churchname: string;
    churchphone: string;
    address: string;
    postalcode: string;
    city: string;
}

export type ChurchMember = {
    id: number;
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