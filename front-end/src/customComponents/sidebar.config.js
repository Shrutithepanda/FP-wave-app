import { Archive, Send, Inbox, Trash3, FileEarmark, Bookmark, ViewList, Check2Circle } from 'react-bootstrap-icons'

export const EMAIL_SIDERBAR_CONTENT = [
    {
        name: "inbox",
        title: "Inbox",
        icon: <Inbox color = "#000" size = {20}  aria-label = "Inbox" />
    },
    {
        name: "sent",
        title: "Sent",
        icon: <Send color = "#000" size = {20} aria-label = "Sent" />
    },
    {
        name: "drafts",
        title: "Drafts",
        icon: <FileEarmark color = "#000" size = {20}  aria-label = "Drafts" />
    },
    {
        name: "archives",
        title: "Archives",
        icon: <Archive color = "#000" size = {20}  aria-label = "Archive" />
    },
    {
        name: "trash",
        title: "Trash",
        icon: <Trash3 color = "#000" size = {20}  aria-label = "Trash" />
    },
    {
        name: "important",
        title: "Important",
        icon: <Bookmark color = "#000" size = {20}  aria-label = "Important" />
    },
]

export const TASK_SIDERBAR_CONTENT = [
    {
        name: "projects",
        title: "Projects",
        icon: <ViewList color = "#000" size = {20}  aria-label = "Projects" />
    },
    {
        name: "completed",
        title: "Completed",
        icon: <Check2Circle color = "#000" size = {20} aria-label = "Completed" />
    },
    {
        name: "drafts",
        title: "Drafts",
        icon: <FileEarmark color = "#000" size = {20}  aria-label = "Drafts" />
    },
    {
        name: "archives",
        title: "Archives",
        icon: <Archive color = "#000" size = {20}  aria-label = "Archive" />
    },
    {
        name: "trash",
        title: "Trash",
        icon: <Trash3 color = "#000" size = {20}  aria-label = "Trash" />
    },
    {
        name: "important",
        title: "Important",
        icon: <Bookmark color = "#000" size = {20}  aria-label = "Important" />
    },
]