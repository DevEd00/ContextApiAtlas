import { MainContext } from "../../context/MainContext"
import { useContext, useEffect, useState } from "react"

export const MyComponent2 = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [record, setRecord] = useState<any>({})
    const { getService } = useContext(MainContext)

    const getData = async () => {
        try {
            const service = getService("empresa/select/all")
            setLoading(true)
            let resp = await service.get(14)
            setRecord(resp)
            setLoading(false)
            console.log('response:_', resp)

        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    useEffect(() => {

        getData()

    }, [])

    if (loading) return (<span>"Loading..."</span>)

    return (
        <>

            {JSON.stringify(record)}

        </>
    )
}
