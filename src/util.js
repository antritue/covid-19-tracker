import numeral from 'numeral'

export const sortData = (data) =>{
    return data.sort((a, b) => {return b.cases - a.cases})
}

export const printStats = (stat) => (
    stat? `+ ${numeral(stat).format('0.0a')}`: '+ 0'
)
