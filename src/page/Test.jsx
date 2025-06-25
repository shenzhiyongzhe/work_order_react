import { MainView } from "../components/MainView"

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useState } from 'react'

const people = [
    { id: 1, name: 'Durward Reynolds' },
    { id: 2, name: 'Kenton Towne' },
    { id: 3, name: 'Therese Wunsch' },
    { id: 4, name: 'Benedict Kessler' },
    { id: 5, name: 'Katelyn Rohan' },
]

function Example()
{
    const [selectedPerson, setSelectedPerson] = useState(people[0])

    return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
            <ListboxButton>{selectedPerson.name}</ListboxButton>
            <ListboxOptions anchor="bottom">
                {people.map((person) => (
                    <ListboxOption key={person.id} value={person} className="group flex gap-2 bg-white data-focus:bg-blue-100">
                        {person.name}
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    )
}

const Test = () =>
{
    return (
        <MainView>
            <div className="text-center text-2xl font-bold">
                这是一个测试页面
                <Example />
            </div>
            <div className="mt-4">
                你可以在这里添加任何内容来测试布局和样式。
            </div>
        </MainView>
    )
}

export default Test
