import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Rate,
    List,
    Avatar,
    Space,
    Typography,
    Spin,
    message,
    Pagination
} from 'antd';
import {
    UserOutlined,
    LikeOutlined,
    DislikeOutlined
} from '@ant-design/icons';
import {
    createCommentApi,
    getProductCommentsApi,
    toggleCommentLikeApi
} from '../../util/apis';

const { TextArea } = Input;
const { Text } = Typography;

const CommentSystem = ({ productId, onCommentAdded }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const [commentForm] = Form.useForm();

    useEffect(() => {
        fetchComments();
    }, [productId, currentPage]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await getProductCommentsApi(productId, currentPage, 10);
            
            if (response && response.EC === 0) {
                setComments(response.DT.comments || []);
                setTotalComments(response.DT.pagination?.totalItems || 0);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (values) => {
        setSubmitting(true);
        
        try {
            const response = await createCommentApi(productId, values.content, values.rating);
            
            if (response && response.EC === 0) {
                message.success('Bình luận đã được thêm');
                commentForm.resetFields();
                setCurrentPage(1); // Reset to first page
                fetchComments();
                if (onCommentAdded) {
                    onCommentAdded();
                }
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (err) {
            console.error('Error creating comment:', err);
            message.error('Có lỗi xảy ra khi tạo bình luận');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const response = await toggleCommentLikeApi(commentId);
            if (response && response.EC === 0) {
                fetchComments(); // Refresh comments
            }
        } catch (err) {
            console.error('Error toggling comment like:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            {/* Comment Form */}
            <Card title="Viết bình luận" style={{ marginBottom: '24px' }}>
                <Form
                    form={commentForm}
                    onFinish={handleSubmitComment}
                    layout="vertical"
                >
                    <Form.Item
                        name="rating"
                        label="Đánh giá sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng chọn đánh giá' }]}
                    >
                        <Rate />
                    </Form.Item>
                    
                    <Form.Item
                        name="content"
                        label="Nội dung bình luận"
                        rules={[
                            { required: true, message: 'Vui lòng nhập nội dung' },
                            { min: 10, message: 'Bình luận phải có ít nhất 10 ký tự' },
                            { max: 500, message: 'Bình luận không được quá 500 ký tự' }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={submitting}
                            size="large"
                        >
                            Gửi bình luận
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Comments List */}
            <Card title={`Bình luận (${totalComments})`}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" />
                    </div>
                ) : comments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Text type="secondary">
                            Chưa có bình luận nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                        </Text>
                    </div>
                ) : (
                    <>
                        <List
                            dataSource={comments}
                            renderItem={(comment) => (
                                <List.Item
                                    style={{ 
                                        padding: '16px 0',
                                        borderBottom: '1px solid #f0f0f0'
                                    }}
                                    actions={[
                                        <Button
                                            type="text"
                                            icon={<LikeOutlined />}
                                            onClick={() => handleLikeComment(comment._id)}
                                            style={{ color: comment.likeCount > 0 ? '#1890ff' : '#8c8c8c' }}
                                        >
                                            {comment.likeCount || 0}
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar 
                                                icon={<UserOutlined />}
                                                style={{ backgroundColor: '#1890ff' }}
                                            />
                                        }
                                        title={
                                            <Space>
                                                <Text strong>{comment.user?.name || 'Người dùng'}</Text>
                                                <Rate 
                                                    disabled 
                                                    value={comment.rating}
                                                    style={{ fontSize: '14px' }}
                                                />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {formatDate(comment.createdAt)}
                                                </Text>
                                            </Space>
                                        }
                                        description={
                                            <div>
                                                <Text>{comment.content}</Text>
                                                {comment.updatedAt !== comment.createdAt && (
                                                    <div style={{ marginTop: '8px' }}>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            (Đã chỉnh sửa)
                                                        </Text>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                        
                        {/* Pagination */}
                        {totalComments > 10 && (
                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                <Pagination
                                    current={currentPage}
                                    total={totalComments}
                                    pageSize={10}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `${range[0]}-${range[1]} của ${total} bình luận`
                                    }
                                />
                            </div>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
};

export default CommentSystem;
