import axios from 'axios';
import { useEffect, useState } from 'react';
import NewMessage from './NewMessage';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import NewListing from './NewListing';
import {
  Box,
  Image,
  Flex,
  Button,
  Heading,
  Text,
  Avatar,
  Spacer,
  Input,
  InputRightElement,
  InputGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { DeleteIcon, ChatIcon, EmailIcon, EditIcon } from '@chakra-ui/icons';

export default function SingleListing() {
  const cookies = new Cookies();
  const token = cookies.get('TOKEN');
  const username = cookies.get('USERNAME');
  const history = useNavigate();
  const [listing, setListing] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isComment, setIsComment] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const deleteModal = useDisclosure();
  const lid = window.location.pathname.split('/')[2];

  useEffect(() => {
    getListing();
    getListingComments();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const getListing = () => {
    axios
      .get(`http://localhost:1234/listings/${lid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setListing({ ...res.data });
      })
      .catch((e) => console.log(e));
  };

  const getListingComments = () => {
    axios
      .get(`http://localhost:1234/comments/${lid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setComments(res.data);
      })
      .catch((e) => console.log(e));
  };

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
  };

  const deleteListing = () => {
    axios
      .delete(`http://localhost:1234/listings/${lid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        history('/listings');
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  const submitComment = (e) => {
    e.preventDefault();
    setIsComment(false);
    if (!newComment) return;
    axios
      .post(
        `http://localhost:1234/comments/${lid}`,
        { content: newComment },
        axiosConfig
      )
      .then((res) => {
        console.log('line 55');
        console.log(res);

        axios.post(
          'http://localhost:1234/notifications',
          {
            title: 'You have a new comment!',
            username: listing.username,
            content: `Your post ${listing.name} has a new comment!`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        getListingComments();
      })
      .catch((e) => console.log(e));
    setNewComment('');
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:1234/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getListingComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      width="75%"
      margin="auto"
      marginTop="5vh"
      marginBottom="5vh"
      borderRadius="md"
      boxShadow="dark-lg"
      overflow="hidden"
      height="80vh"
    >
      <Flex height="100%">
        {/* Left side - Background image with blur effect */}
        <Box flex="1" position="relative" zIndex="1" overflow="hidden">
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex="-1"
            filter="blur(25px)"
            webkitFilter="blur(25px)"
            backgroundImage={`url(http://localhost:1234/images/listings/${listing.image})`}
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundPosition="center"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
          {/* Content inside the Box */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Image
              src={`http://localhost:1234/images/listings/${listing.image}`}
              alt="Listing image"
            />
          </Box>
        </Box>

        {/* Right side - Sidebar with listing information */}
        <Box
          flex="0.3"
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="md"
          position="sticky"
          top={4}
          maxHeight="calc(100vh - 10vh)"
        >
          <Flex flexDirection="column" height="100%">
            <Box flex="1" overflowY={'auto'}>
              <Heading size="xl">{listing.name}</Heading>
              <Heading size="md" mb="2">
                ${listing.price}
              </Heading>
              {listing.username === username && (
                <Flex alignItems="center">
                  {/* Edit Button */}
                  <Button variant="ghost" onClick={handleOpenEditModal}>
                    <EditIcon mr={2} />
                    Edit Listing
                  </Button>

                  {/* Delete Button */}
                  <Button variant="ghost" onClick={deleteModal.onOpen}>
                    <DeleteIcon mr={2} />
                    Delete Listing
                  </Button>
                </Flex>
              )}
              <Text fontWeight="bold" mb="2">
                <Avatar size="sm" name={listing.username} mr="2" />
                {listing.username}
                <EmailIcon
                  ml={'2'}
                  boxSize="6"
                  color="gray.400"
                  cursor="pointer"
                  transition="color 0.2s ease"
                  _hover={{ color: 'cyan.500' }}
                  onClick={handleOpenModal}
                />
              </Text>
              <Heading size="md" mb="1">
                Details
              </Heading>
              {listing.type === 'sublet' ? (
                <Text as="span" display="block" mb={2}>
                  <Text as="span" fontWeight="bold">
                    Residence:
                  </Text>{' '}
                  {listing.res_name}
                  <br />
                  <Text as="span" fontWeight="bold">
                    Unit Type:
                  </Text>{' '}
                  {listing.unit}
                </Text>
              ) : (
                <Text as="span" display="block" mb={2}>
                  <Text as="span" fontWeight="bold">
                    Quantity:
                  </Text>{' '}
                  {listing.quantity}
                </Text>
              )}

              <Text mb={2}>{listing.description}</Text>

              <Heading size="md">Comments</Heading>
              {comments.map((comment) => {
                return (
                  <Flex key={comment.id} alignItems="center" mb={3}>
                    {/* Username and Avatar */}
                    <Avatar size="sm" name={comment.username} mr={2} />
                    <Box flex="1">
                      <Box fontWeight="bold">{comment.username}</Box>
                      <Box>{comment.content}</Box>
                    </Box>
                    {comment.username === cookies.get('USERNAME') && (
                      <>
                        <Spacer />
                        <DeleteIcon
                          onClick={(e) => deleteComment(comment.cid)}
                          size="sm"
                          variant="solid"
                          cursor="pointer"
                          color="gray.400"
                          transition="color 0.2s ease"
                          _hover={{ color: 'red.500' }}
                        >
                          Delete Comment
                        </DeleteIcon>
                      </>
                    )}
                  </Flex>
                );
              })}
            </Box>
            <Flex justifyContent="center" alignItems="center" mt="auto" pb={4}>
              <InputGroup>
                <Input
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                  }}
                  pr="4rem"
                />
                <InputRightElement width="4rem">
                  <ChatIcon
                    color="gray.400"
                    cursor="pointer"
                    transition="color 0.2s ease"
                    _hover={{ color: 'blue.500' }}
                    onClick={submitComment}
                  />
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <NewMessage
        props={{
          listing,
          token,
        }}
        isOpen={isModalOpen}
        onOpen={handleOpenModal}
        onClose={handleCloseModal}
      />
      <NewListing
        props={{
          listing,
          username,
          token,
        }}
        isOpen={isEditModalOpen}
        onOpen={handleOpenEditModal}
        onClose={handleCloseEditModal}
      />

      <Modal
        borderRadius="2rem"
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            Are you sure you want to delete this listing?
          </ModalHeader>
          <ModalBody>
            {/* Add any additional content here, if needed */}
          </ModalBody>
          <ModalFooter justifyContent="center">
            {' '}
            {/* Use "justifyContent" to center the buttons */}
            <Button
              variant="ghost"
              colorScheme="gray"
              mr={3}
              onClick={deleteModal.onClose}
            >
              Cancel
            </Button>
            <Button colorScheme="red" onClick={deleteListing}>
              Delete Listing
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
