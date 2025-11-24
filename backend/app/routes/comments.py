from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models import Comment, Event, User

bp = Blueprint('comments', __name__, url_prefix='/comments')


@bp.route('/event/<event_uid>', methods=['GET'])
def get_event_comments(event_uid):
	"""Get all comments for an event (hierarchical structure)"""
	event = Event.query.get(event_uid)
	if not event:
		return jsonify({'msg': 'event not found'}), 404
	
	# Get all top-level comments (no parent)
	top_comments = Comment.query.filter_by(event_uid=event_uid, parent_uid=None).order_by(Comment.created_at.desc()).all()
	
	def build_comment_tree(comment):
		user = User.query.get(comment.user_uid)
		replies_data = []
		for reply in comment.replies:
			replies_data.append(build_comment_tree(reply))
		
		return {
			'uid': comment.uid,
			'content': comment.content,
			'created_at': comment.created_at.isoformat(),
			'user_name': user.name if user else 'Unknown',
			'user_uid': comment.user_uid,
			'replies': replies_data
		}
	
	result = [build_comment_tree(comment) for comment in top_comments]
	return jsonify(result), 200


@bp.route('/', methods=['POST'])
@jwt_required()
def create_comment():
	"""Create a new top-level comment on an event"""
	uid = get_jwt_identity()
	data = request.get_json() or {}
	
	event_uid = data.get('event_uid')
	content = data.get('content')
	
	if not event_uid or not content:
		return jsonify({'msg': 'event_uid and content are required'}), 400
	
	event = Event.query.get(event_uid)
	if not event:
		return jsonify({'msg': 'event not found'}), 404
	
	if not content.strip():
		return jsonify({'msg': 'content cannot be empty'}), 400
	
	comment = Comment(event_uid=event_uid, user_uid=uid, content=content.strip())
	db.session.add(comment)
	db.session.commit()
	
	user = User.query.get(uid)
	return jsonify({
		'uid': comment.uid,
		'content': comment.content,
		'created_at': comment.created_at.isoformat(),
		'user_name': user.name if user else 'Unknown',
		'user_uid': uid,
		'replies': []
	}), 201


@bp.route('/<comment_uid>/reply', methods=['POST'])
@jwt_required()
def reply_to_comment(comment_uid):
	"""Reply to an existing comment"""
	uid = get_jwt_identity()
	data = request.get_json() or {}
	
	content = data.get('content')
	if not content:
		return jsonify({'msg': 'content is required'}), 400
	
	parent_comment = Comment.query.get(comment_uid)
	if not parent_comment:
		return jsonify({'msg': 'parent comment not found'}), 404
	
	if not content.strip():
		return jsonify({'msg': 'content cannot be empty'}), 400
	
	reply = Comment(
		event_uid=parent_comment.event_uid,
		user_uid=uid,
		parent_uid=comment_uid,
		content=content.strip()
	)
	db.session.add(reply)
	db.session.commit()
	
	user = User.query.get(uid)
	return jsonify({
		'uid': reply.uid,
		'content': reply.content,
		'created_at': reply.created_at.isoformat(),
		'user_name': user.name if user else 'Unknown',
		'user_uid': uid,
		'replies': []
	}), 201
