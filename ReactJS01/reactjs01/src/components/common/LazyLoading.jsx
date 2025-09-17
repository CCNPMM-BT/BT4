import React, { useEffect, useRef, useState } from 'react';
import { Spin, Alert } from 'antd';

const LazyLoading = ({ 
    children, 
    onLoadMore, 
    hasMore, 
    loading, 
    error,
    threshold = 0.1 
}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observerRef = useRef();
    const sentinelRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsIntersecting(entry.isIntersecting);
                
                if (entry.isIntersecting && hasMore && !loading) {
                    onLoadMore();
                }
            },
            {
                threshold,
                rootMargin: '100px'
            }
        );

        observerRef.current = observer;

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loading, onLoadMore, threshold]);

    return (
        <div>
            {children}
            
            {hasMore && (
                <div ref={sentinelRef} style={{ height: '20px', margin: '20px 0' }}>
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: '10px' }}>Đang tải thêm sản phẩm...</div>
                        </div>
                    )}
                </div>
            )}
            
            {!hasMore && !loading && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                    Đã hiển thị tất cả sản phẩm
                </div>
            )}
            
            {error && (
                <Alert
                    message="Lỗi tải dữ liệu"
                    description={error}
                    type="error"
                    showIcon
                    style={{ margin: '20px 0' }}
                />
            )}
        </div>
    );
};

export default LazyLoading;


