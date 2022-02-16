export default class CrunchData {
    data = [];
    expenseTags = [];

    actuals = [];

    constructor() { };



    sumValues(keyName, expenseTag, dataObject) {
        let total = 0;
        for (const object of dataObject) {
            if (object['Budget Category'] === expenseTag) {
                
                total += object[keyName]
            }
            // console.log(object[keyName])
        }
        return total;
    }

    getTotalByBudgetVariance(budgetVarianceObj) {
        let total = 0;
        for (const [key, value] of Object.entries(budgetVarianceObj)) {
            if (key !== 'type')
                total += value
        }
        total = Math.round((total + Number.EPSILON) * 100) / 100;
        return total;
        // console.log('total', total)
    }

    getExpenseTags() {
        let duplicateTags = [];
        let expenseTags = []
        for (const object of this.data) {
            if (object['Budget Category'] === '')
                break;
            duplicateTags.push(object['Budget Category'])
        }
        // remove duplicates
        expenseTags = [...new Set(duplicateTags)];
        return expenseTags;

    }

    setForecastByExpenseTag() {
        const type = 'Forecast';
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.data)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }

    setActualsByExpenseTag() {
        const type = 'Actual';
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.data)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }

    setDifferenceByExpenseTag() {
        const type = 'difference';
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.data)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }

    setPaymentsByExpenseTag() {
        const type = 'Paid (Dai)'
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.data)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }


    crunchData() {
        this.setForecastByExpenseTag();
        this.setActualsByExpenseTag();
        // this.setDifferenceByExpenseTag();
        this.setPaymentsByExpenseTag();
    }

    async uploadData() {
        console.log('Storing Actuals');
        await addData(this.actuals, 'novemberActuals')
    }

    async getData(filteredByMonth) {
        this.data = filteredByMonth
        // console.log(this.data['June 2021'])
        this.expenseTags = this.getExpenseTags()
        console.log('expenseTags', this.expenseTags)

    }

    // console.log(await get('novemberActuals')); 

}



