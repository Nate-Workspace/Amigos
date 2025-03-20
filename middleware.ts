import {withAuth} from 'next-auth/middleware'

export default withAuth ({
    pages:{
        signIn: "/"
    }
})

export const config ={
    matcher : [
        '/users/:path*',   // This will also include the nested routes inside /users
        '/conversations/:path*'
    ]
}