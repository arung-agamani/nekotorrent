import React, { PropsWithChildren, useState } from 'react'
import { IUser } from '../interfaces'

export const UserContext = React.createContext(null);

const userProvider = ({children})=> {
    const [user, setUser] = useState<IUser>({
        username: '',
        userId: '',
        status: false
    });

    const updateUser = (user: IUser) => {
        if (user.status) {
            setUser(user);
        }
    }

    return <UserContext.Provider value={user}>
        {children}
    </UserContext.Provider>
}

export default userProvider;
