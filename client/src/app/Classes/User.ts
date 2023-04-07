export class User{
    _id : any | undefined;
    nom : string  | undefined;
    prenom : string | undefined;
    email : string | undefined;
    pwd : string | undefined;
    villes : any[] = [];
    notification : any[] = [];

    constructor({_id,nom, prenom,email,pwd,villes,notification}: {
        _id? : string,
        nom?: string,
        prenom?: string,
        email? : string,
        pwd? : string,
        villes? : any[],
        notification? : any[]
    }) {
        this._id = _id,
        this.nom = nom,
        this.prenom = prenom,
        this.email = email,
        this.pwd = pwd,
        this.villes = villes ?? [],
        this.notification = notification ?? []
    }
}