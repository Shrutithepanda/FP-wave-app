import React from "react"
import AuthProvider from "./AuthProvider"
import { useAuth } from './AuthProvider'
import '@testing-library/jest-dom'
import supabase from '../supabase/supabaseClient'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import LoginPage from "../pages/LoginPage"
import { MemoryRouter } from "react-router-dom"

// Mock the supabase client
vi.mock("../supabase/supabaseClient")

// Clear and unsubsribe before every event
beforeEach(() => {
    vi.clearAllMocks()

    supabase.auth.getUser.mockResolvedValue({
        data: {user: null}
    })

    supabase.auth.onAuthStateChange.mockResolvedValue({
        data: {subscription: {unsubscribe: vi.fn()}}
    })
})

test("successfully defines supabase client", () => {
    const supabase = require("../supabase/supabaseClient")
    expect(supabase).toBeDefined()
})

test("user is logged in with correct credentials", async () => {
    supabase.auth.getUser.mockResolvedValue({
        data: { user: null },
    })

    supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
    })
    
    supabase.auth.signInWithPassword.mockResolvedValue({
        data: {session: 
            {user: {id: "c6458d17-01d8-4daf-b96e-98b5c1633639"}}
        },
        error: null
    })

    render(
        <MemoryRouter>
            <AuthProvider>
                <LoginPage/>
            </AuthProvider>
        </MemoryRouter>
    )

    fireEvent.click(screen.getByTestId("login-btn"))

    await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalled()

        // expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(
        //     expect.objectContaining({
        //         email: "wave.app.testuser@gmail.com",
        //         password: "finalApp@2025",
        //     })
        // )

        // expect(screen.getByText("wave.app.testuser@gmail.com")).toBeTruthy();
    })
})

// Auth context provider helper function
// const authContext = (screen, value) => {
//     return render(
//         <AuthProvider value = {value}>
//             {screen}
//         </AuthProvider>
//     )
// }

// test("shows log in screen if user is not logged in", () => {
//     authContext(<LoginPage />, {user: null})
//     expect(screen.getByText(/log in/i)).toBeInTheDocument()
// })


// test('renders without crashing', () => {
//     const { container } = render(<LoginPage />);
//     expect(container).toBeTruthy();
// });


// test('a user can login with correct credentials', async () => {
//     const { login, authenticated } = useAuth()
//     const user = await login("user1@gmail.com", "finalApp@2025")
//     expect(user.session).toBeTruthy()
//     expect(authenticated).toBe(true)
// });