import { RootState } from '@data/redux/Store'
import useAPI from '@hooks/useApi'
import axios from 'axios'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'


const useStackHolderProfile = () => {

    const [isEditing, setIsEditing] = useState(false)
    const profile = useSelector((state: RootState) => state.auth.userProfile)
    const [email, setEmail] = useState(profile?.obj.profile.email)
    const [StoredTokens, CallAPI] = useAPI()

    //function:: handle to update the email id of the profile 
    const handleOnUpdateProfile = async () => {
        try {
            const axiosInstance = axios.create()
            const method = 'post'
            const endpoint = '/auth/api/update_email/'
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const body = {
                email: email
            }
            const response_obj = await CallAPI(
                StoredTokens,
                axiosInstance,
                endpoint,
                method,
                header,
                body
            )
            if (response_obj.error === false) {
                toast.success('Email updated successfully')
                setEmail(response_obj.response?.data.email)
            }
            else{
                toast.error(response_obj.errorMessage?.message)
            }
        }
        catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        }
    }
    return {
        isEditing,
        email,
        profile,
        setIsEditing,
        setEmail,
        handleOnUpdateProfile
    }
}

export default useStackHolderProfile