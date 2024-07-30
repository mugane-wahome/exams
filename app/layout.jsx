import React from 'react'
import '@styles/global.css'
import Nav from '@components/Nav'

export const metadata = {
    title: "Prep & Learn",
    description: "Practice to your heart content."
}
const RootLayout = ({ children }) => {
    return (
        <html lang='en'>
            <body>
                <main className="app">
                    <Nav />
                    {children}
                </main>
            </body>
        </html>
    )
}

export default RootLayout