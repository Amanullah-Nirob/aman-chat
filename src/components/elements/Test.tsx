import Link from 'next/link';
import Router  from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import {useAppSelector} from '../../app/hooks'
 import {selectCurrentUser} from '../../app/slices/auth/authSlice'
import UserListItem from './UserListItem';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';


function useDebounce(value:string, delay:number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const Test = () => {
const loggedinUser=useAppSelector(selectCurrentUser)

    const inputEl = useRef(null);
    const [isSearch, setIsSearch] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(keyword, 300);



    function handleClearKeyword() {
        setKeyword('');
        setIsSearch(false);
        setLoading(false);
    }



    useEffect(() => {
        if (debouncedSearchTerm) {
            setLoading(true);
            if (keyword) {
                fetch(`${process.env.API_URL}/api/user?search=${keyword}`,{
                    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${loggedinUser.token}` },
                }).then(res=>res.json())
                .then(data=>{
                    if(data){
                        setLoading(false);
                        setSearchResult(data);
                        setIsSearch(true);
                    }
                })   
            } else {
                setIsSearch(false);
                setKeyword('');
            }
            if (loading) {
                setIsSearch(false);
            }
        } else {
            setLoading(false);
            setIsSearch(false);
        }
    }, [debouncedSearchTerm]);


    // Views
    let productItemsView,
    clearTextView,
    loadingView

    if (!loading) {
            if (searchResult && searchResult.length > 0) {
                productItemsView = searchResult.map((user:any) => (
                    <UserListItem 
                     user={user}   truncateValues={[27, 24]} 
                     key={user._id} />
                ));
            } else {
                productItemsView = <p>No product found.</p>;
            }
            if (keyword !== '') {
                clearTextView = (
                    <span className="form-action" onClick={handleClearKeyword}>
                     <CloseIcon />
                    </span>
                );
            }
        } else {
            loadingView = (
                <span className="form-action">
                   <CircularProgress />
                </span>
            );
        }

    return (
        <div>
        <form className="search-area-main">

            <div className="search-input">
                 <input
                    ref={inputEl}
                    type="text"
                    value={keyword}
                    placeholder='search'
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {clearTextView}
                {loadingView}
            </div>

            <div
                className={`search-result${
                    isSearch ? ' active ' : ''
                }`}>
                <div className="ps-panel__content"
                onClick={(e:any)=>{
                   
                    const userId = e.target.dataset.user || e.target.alt;
                    console.log(userId);
                    if (!userId) return;
                }}
                >{productItemsView}</div>
            </div>
        </form>
        </div>
    );
};

export default Test;