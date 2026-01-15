import React, { useEffect, useState } from 'react'
import supabase from '../supabase/supabaseClient'
import { useNavigate } from 'react-router-dom'

import AppHeader from '../customComponents/AppHeader'
import Loader from '../customComponents/Loader'
import SideBar from '../customComponents/Sidebar'
import { useAuth } from '../hooks/AuthProvider'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Emails = () => {
    const navigate = useNavigate()
    const [emailData, setEmailData] = useState([{}])
    const [loading, setLoading] = useState(false)

    const { user, session } = useAuth()

    // console.log(session)

    useEffect(() => {
        fetch("/emails")
        .then(
            response => response.json()
        )
        .then(
            data => {
                setEmailData(data)
            }
        )
    }, [])

    return (
        <Container className = "d-flex-column">
            <AppHeader />
            
            <main className = "my-5 mx-0">
                <Container>
                    <Row>
                        <Col xs = {12} md = {4} >
                            <SideBar />
                        </Col>
                    
                        <Col xs = {12} md = {8}>
                            <h4>{user?.email}</h4>
                            {loading 
                                ? <>
                                    <Loader /> 
                                </>
                                : <>
                                    {/* Show loading if data is not fetched or is currently fetching, otherwise show data */}
                                    {(typeof emailData === 'undefined') 
                                    ? (
                                        <p>Loading...</p>
                                    ) 
                                    : (
                                        emailData.map((email, index) => (
                                            <div key = {index} className = 'Container-items'>
                                                <p style={{fontWeight: 'bold'}} >{email.title}</p>
                                                <p>{email.body}</p>
                                                <p style = {{border: '1px solid gray', width: '130px', borderRadius: '5px', textAlign: 'center'}} >{email.tags}</p>
                                            </div>
                                        ))
                                    )}
                                </>
                            }
                        </Col>
                    </Row>
                </Container>
            </main>

        </Container>
    )
}

export default Emails