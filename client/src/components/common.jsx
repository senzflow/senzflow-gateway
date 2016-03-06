import React from "react"
import { Link } from 'react-router'
import { Component } from './base.jsx'

export function NotFound(props) {
    return <div><h1>没有该页面</h1><Link to="/">返回首页</Link></div>
}

export function PlaceHolder(props) {
    return <div>{props.children}</div>
}

