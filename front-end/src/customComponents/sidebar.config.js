import { Archive, Send, Inbox, Trash3, FileEarmark, Bookmark } from 'react-bootstrap-icons'

export const SIDERBAR_CONTENT = [
    {
        name: "inbox",
        title: "Inbox",
        icon: <Inbox color = "black" size = {20}  aria-label = "Inbox" />
    },
    {
        name: "sent",
        title: "Sent",
        icon: <Send color = "black" size = {20} aria-label = "Sent" />
    },
    {
        name: "drafts",
        title: "Drafts",
        icon: <FileEarmark color = "black" size = {20}  aria-label = "Drafts" />
    },
    {
        name: "archives",
        title: "Archives",
        icon: <Archive color = "black" size = {20}  aria-label = "Archive" />
    },
    {
        name: "trash",
        title: "Trash",
        icon: <Trash3 color = "black" size = {20}  aria-label = "Trash" />
    },
    {
        name: "high-priority",
        title: "Important",
        icon: <Bookmark color = "black" size = {20}  aria-label = "High Priority" />
    },
]
