export type Church = {
    id: number;
    name: string;
    phone: string;
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