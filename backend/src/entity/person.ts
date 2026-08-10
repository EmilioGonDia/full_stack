

export class Person
{
    private id:number =0;
    private name:string="";
    private surname:string="";

    public Person(id:number,name:string,surname:string)
    {
        this.id=id;
        this.name=name;
        this.surname=surname;

    }

    public getId():number
    {
        return this.id;
    }
    
    public getName():string
    {
        return this.name;
    }

    public getSurname():string
    {
        return this.surname;
    }



}