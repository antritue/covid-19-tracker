import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css'

function InfoBox({title, cases, total, onClick, active, casesType}) {
    return (
        <Card onClick={onClick} className={`infoBox ${active && `selected--${casesType}`}`}>
            <CardContent>
                <Typography color='textSecondary' className='infoBox__title'>
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${active && `title--${casesType}`}`}>{cases}</h2>
                <Typography color='textSecondary' className='infoBox__total'>
                    {`${total} total`}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
