const msgSubjects = {
  poPending: (body) => 'You have a pending purchase order',
  poApproved: (body) => 'Your purchase order has been approved',
  poRejected: (body) => 'Your purchase order has been rejected',
  poRequisition: (body) => `Requisition information for Purchase order from ${body.name}`,
  postPending: (body) => `${body.name} has created a post`,
  postApproved: (body) => 'Your post has been approved.',
  postRejected: (body) => `${body.email} has rejected your post`
}
export default msgSubjects
