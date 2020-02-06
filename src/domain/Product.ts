interface Amount {
    numericAmount: number,
    unit: 'l' | 'g'
}

interface Money {
    numericAmount: number,
    currency: 'EUR'
}

export class Product {
    constructor(public readonly name: string,
                public readonly packagingType: string,
                public readonly amount: string,
                public readonly price: string) {
    }

    static withName(name: string){
        return new Product(name, '', '', '')
    }

}
