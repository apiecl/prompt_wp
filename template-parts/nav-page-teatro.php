
				<?php 
				$args = array(
					'post_type' 	=> 'page',
					'number_posts' 	=> 1,
					'meta_key'		=> '_wp_page_template',
					'meta_value'	=> 'page-template-teatro.php'
				);

				$main = get_posts( $args);

				$childs = get_children( array(
					'post_type' => 'page',
					'post_parent' => $main[0]->ID
				) );

				if(is_page_template('page-template-timeline-teatro.php')) {
					$function = 'timeline-teatro';
					$target = 'timeline-embed';
				} elseif( is_page_template('page-template-materiales-teatro.php')) {
					$function = 'materiales-teatro';
					$target = 'materialesTabsContent';
				} else {
					$function = 'none';
					$target = 'none';
				}

				?>


				<div class="cabecera-obra">
					<?php 
					$imageid = get_post_thumbnail_id($main[0]->ID);
					$imagesrc = wp_get_attachment_image_src( $imageid, 'full', false );
					?>
					<?php get_template_part('template-parts/brand-header');?>
					<div class="text">
					
					<h3 class="header-obra-title">Teatro UC histórico</h3>
					<h1 class="play-title"><?php the_title();?></h1>
					
					</div>
			

				<nav class="nav nav-pills nav-justified" id="obraTab" role="tablist" data-page-id="<?php echo $main[0]->ID;?>" data-function="<?php echo $function;?>" data-target="<?php echo $target;?>">
					
					<a aria-selected="true" id="elteatro-tab" href="<?php echo get_permalink($main[0]->ID);?>" class="nav-item nav-link <?php echo ($main[0]->ID == $post->ID ? 'active' : '');?>"><?php echo $main[0]->post_title;?></a>

					<?php 
					$i = 0;
					foreach($childs as $page):
						$i++;
						?>
						
						<a aria-selected="false" id="timeline-tab"href="<?php echo get_permalink($page->ID);?>" class="nav-item nav-link <?php echo ($i == count($childs)? 'last' : '' );?> <?php echo ($page->ID == $post->ID ? 'active' : '');?>"><?php echo $page->post_title;?></a>
						
					<?php endforeach;?>
				</nav>

				</div>
